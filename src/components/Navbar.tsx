import { Lightbulb, TrendingUp } from "lucide-react";

export function Navbar({ hasData, onNewAnalysis }: { hasData: boolean; onNewAnalysis: () => void }) {
  return (
    <nav className="h-16 flex items-center justify-between px-6 border-b border-black/5 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-brand-purple rounded-xl flex items-center justify-center shadow-lg shadow-brand-purple/20 cursor-pointer" onClick={onNewAnalysis}>
          <TrendingUp size={16} className="text-white" />
        </div>
        <span className="font-sans font-bold text-lg tracking-tight text-gray-900 cursor-pointer" onClick={onNewAnalysis}>FounderVision</span>
      </div>
      
      <div className="hidden md:flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
        <NavLink href="#" label="Home" active={!hasData} />
        <NavLink href="#" label="Dashboard" active={hasData} />
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={onNewAnalysis}
          className="hidden sm:block px-4 py-2 bg-brand-purple text-white rounded-xl text-xs font-bold hover:bg-brand-purple/90 transition-all shadow-sm active:scale-95"
        >
          New Analysis
        </button>
      </div>
    </nav>
  );
}

function NavLink({ label, href, active = false }: { label: string; href: string; active?: boolean }) {
  return (
    <a 
      href={href} 
      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
        active ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
      }`}
    >
      {label}
    </a>
  );
}
