import { Settings, Shield, HelpCircle, LogOut, ChevronUp } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../contexts/AuthContext";

export function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const { user, signOut } = useAuth();

  if (!user) return null;

  const email = user.email || "user@example.com";
  const initial = email.charAt(0).toUpperCase();
  const name = email.split("@")[0];

  return (
    <>
      <div className="fixed bottom-6 left-6 z-[60]">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="mb-3 bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-gray-200/50 p-2 min-w-[200px]"
            >
              <div className="p-3 border-b border-gray-50 mb-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Account</p>
                <p className="text-xs font-bold text-gray-900 truncate">{email}</p>
              </div>
              <ProfileMenuItem icon={<Settings size={14} />} label="Settings" onClick={() => { setActiveModal('Settings'); setIsOpen(false); }} />
              <ProfileMenuItem icon={<Shield size={14} />} label="Security" onClick={() => { setActiveModal('Security'); setIsOpen(false); }} />
              <ProfileMenuItem icon={<HelpCircle size={14} />} label="Help Center" onClick={() => { setActiveModal('Help Center'); setIsOpen(false); }} />
              <div className="mt-1 pt-1 border-t border-gray-50">
                <ProfileMenuItem 
                  icon={<LogOut size={14} />} 
                  label="Log out" 
                  className="text-red-500 hover:bg-red-50" 
                  onClick={() => { 
                    signOut();
                    setIsOpen(false); 
                  }} 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-[165px] flex items-center gap-3 p-2 bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 hover:border-brand-purple/30 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-white font-bold shadow-inner uppercase">
            {initial}
          </div>
          <div className="text-left hidden sm:block pr-2">
            <p className="text-xs font-bold text-gray-900 leading-none mb-1 truncate max-w-[80px]">{name}</p>
            <p className="text-[10px] font-bold text-brand-teal uppercase tracking-tighter">Pro Plan</p>
          </div>
          <ChevronUp size={14} className={`text-gray-400 transition-transform duration-300 ml-auto ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">{activeModal}</h2>
              <p className="text-sm text-gray-500 mb-8">This section is currently under development.</p>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-6 py-2 bg-gray-100 text-gray-900 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function ProfileMenuItem({ icon, label, className = "", onClick }: { icon: React.ReactNode; label: string; className?: string; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all ${className}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
