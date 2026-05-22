import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { AnalyzerForm } from './components/AnalyzerForm';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (idea: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze. Please try again.');
      }

      const result = await response.json();
      setData(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-surface font-sans selection:bg-brand-purple/30 selection:text-brand-purple text-gray-900 overflow-x-hidden">
      <Navbar hasData={!!data} onNewAnalysis={handleReset} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <AnimatePresence mode="wait">
          {!data ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <AnalyzerForm onAnalyze={handleAnalyze} isLoading={isLoading} />
              
              {error && (
                <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in fade-in zoom-in-95">
                  <AlertCircle size={20} />
                  <p className="font-medium text-sm">{error}</p>
                </div>
              )}

              {/* Landing Features Section */}
              <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                <LandingFeature 
                  title="Deep Market Scraping" 
                  desc="Gemini-powered real-time analysis of market segments and growth trajectories."
                />
                <LandingFeature 
                  title="Competitive Matrix" 
                  desc="Instant teardowns of major players and their strategic vulnerabilities."
                />
                <LandingFeature 
                  title="Risk Assessment" 
                  desc="Detailed SWOT analysis and instability indices for informed decision making."
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="pt-12"
            >
              <div className="flex items-center justify-between mb-8">
                <button 
                  onClick={handleReset}
                  className="flex items-center gap-2 text-sm font-bold text-black/40 hover:text-black transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back to Analysis
                </button>
                <div className="hidden sm:flex items-center gap-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Showing analysis for:</span>
                  <span className="text-xs font-bold bg-brand-purple/10 text-brand-purple px-3 py-1 rounded-full">{data.title}</span>
                </div>
              </div>
              
              <AnalysisDashboard data={data} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Decoration */}
      {!data && (
        <div className="fixed bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white to-transparent pointer-events-none -z-10" />
      )}
    </div>
  );
}

function LandingFeature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-1">
      <div className="w-12 h-12 bg-gray-50 rounded-2xl mb-6 flex items-center justify-center">
        <div className="w-2 h-2 bg-brand-purple rounded-full animate-pulse" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-sm text-gray-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}
