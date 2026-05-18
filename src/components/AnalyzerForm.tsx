import { useState } from "react";
import { Search, Sparkles, Loader2, Rocket } from "lucide-react";
import { cn } from "../lib/utils";

interface AnalyzerFormProps {
  onAnalyze: (idea: string) => void;
  isLoading: boolean;
}

export function AnalyzerForm({ onAnalyze, isLoading }: AnalyzerFormProps) {
  const [idea, setIdea] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim()) {
      onAnalyze(idea);
    }
  };

  const suggestions = [
    "AI-powered fitness coach",
    "Rare succulent subscription",
    "Robotic grocery delivery",
    "Decentralized cloud storage"
  ];

  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
          <Sparkles size={14} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Powered by Gemini Pro</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 max-w-3xl mx-auto leading-[1.1]">
          Market analysis for the <span className="text-brand-purple">modern founder.</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
          Get high-fidelity market data, competitor teardowns, and strategic roadmaps in seconds.
        </p>
      </div>

      <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl shadow-gray-200 border border-gray-100 max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 flex items-center gap-4 px-6 py-4">
            <div className="p-2 bg-gray-50 rounded-xl">
              <Search className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Industry, product idea, or market segment..."
              className="w-full text-lg font-medium outline-none placeholder:text-gray-300"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !idea.trim()}
            className="bg-brand-purple text-white px-8 py-4 rounded-[1.8rem] font-bold hover:bg-brand-purple/90 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Rocket size={18} />
                <span>Run Analysis</span>
              </>
            )}
          </button>
        </form>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => setIdea(s)}
            className="px-4 py-2 rounded-xl bg-white border border-gray-100 text-xs font-semibold text-gray-500 hover:border-brand-purple hover:text-brand-purple transition-all shadow-sm"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
