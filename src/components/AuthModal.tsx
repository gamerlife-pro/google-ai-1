import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

export function AuthModal({ 
  isOpen, 
  onClose, 
  initialMode = 'login' 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isConfigured = !!import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL.startsWith('http');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured) return;
    
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setSuccessMsg('Check your email to confirm your account.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onClose();
      }
    } catch (err: any) {
      if (err.message.includes('fetch')) {
        setError("Unable to connect to Supabase. Check your .env setup.");
      } else {
        setError(err.message || 'An error occurred during authentication.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative border border-gray-100"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {mode === 'login' ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {mode === 'login' 
              ? 'Enter your details to access your account' 
              : 'Sign up to start analyzing ideas'}
          </p>

          {!isConfigured && (
            <div className="p-4 mb-6 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-800">
              <div className="flex items-center gap-2 font-bold mb-1">
                <AlertCircle size={16} />
                Supabase Not Configured
              </div>
              <p className="opacity-80 leading-relaxed text-xs">
                To enable authentication, you must provide your Supabase Project URL and Anon Key via environment variables (<code className="bg-amber-100 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> and <code className="bg-amber-100 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code>).
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={14} />
                {error}
              </div>
            )}
            
            {successMsg && (
              <div className="p-3 bg-green-50 text-green-600 rounded-xl text-xs font-semibold flex items-center gap-2">
                <Mail size={14} />
                {successMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isConfigured}
              className="w-full bg-gray-900 text-white rounded-xl py-3 text-sm font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20 disabled:opacity-50 flex items-center justify-center gap-2 mt-6 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-500 font-medium">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError(null);
                setSuccessMsg(null);
              }}
              className="text-brand-purple font-bold hover:text-brand-purple/80"
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
