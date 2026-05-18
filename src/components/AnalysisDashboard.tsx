import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { 
  AlertTriangle, Lightbulb, Zap, Users, Trophy, 
  MapPin, CheckCircle2, XCircle, ShieldCheck, TrendingUp
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Compentitor {
  name: string;
  strength: string;
  weakness: string;
}

interface TargetAudience {
  segment: string;
  size: string;
  painPoint: string;
}

interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface AnalysisData {
  title: string;
  summary: string;
  marketSize: { year: string; value: number }[];
  competitors: Compentitor[];
  swot: SWOT;
  targetAudience: TargetAudience[];
  recommendation: string;
}

export function AnalysisDashboard({ data }: { data: AnalysisData }) {
  const COLORS = ['#7C3AED', '#14B8A6', '#3B82F6', '#F59E0B'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Market Potential" 
          value={`$${data.marketSize[data.marketSize.length-1]?.value}B`} 
          trend="+15.8% vs LY" 
          icon={<TrendingUp size={18} />} 
          color="brand-purple"
        />
        <StatCard 
          label="Competition" 
          value={data.competitors.length.toString()} 
          trend="Mid-level density" 
          icon={<Trophy size={18} />} 
          color="brand-teal"
        />
        <StatCard 
          label="Risk Index" 
          value="Low" 
          trend="8.3% instability" 
          icon={<ShieldCheck size={18} />} 
          color="brand-blue"
        />
        <StatCard 
          label="Audience" 
          value={data.targetAudience.length.toString()} 
          trend="Multi-sector" 
          icon={<Users size={18} />} 
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Chart */}
        <DashboardCard 
          title="Market Size Forecast" 
          subtitle="Projected growth segments ($B)"
          className="lg:col-span-8"
          id="market-size"
        >
          <div className="h-72 mt-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.marketSize} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity={1} />
                    <stop offset="100%" stopColor="#C4B5FD" stopOpacity={0.8} />
                  </linearGradient>
                  <filter id="shadow" height="130%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                    <feOffset dx="0" dy="4" result="offsetblur" />
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.1" />
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F3F4F6" />
                <XAxis 
                  dataKey="year" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#9CA3AF', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#9CA3AF', fontWeight: 600 }}
                />
                <Tooltip 
                  cursor={{ fill: '#F9FAFB' }}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                    padding: '12px'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="url(#barGradient)" 
                  radius={[10, 10, 10, 10]} 
                  barSize={36}
                  filter="url(#shadow)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        {/* Audience Card */}
        <DashboardCard 
          title="Distribution" 
          subtitle="Target Audience Segments"
          className="lg:col-span-4"
        >
          <div className="h-44 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.targetAudience}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey={(d) => {
                    // Extract number from size string (e.g. "500k")
                    const match = d.size.match(/\d+/);
                    return match ? parseInt(match[0]) : 10;
                  }}
                >
                  {data.targetAudience.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {data.targetAudience.map((aud, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-[10px] font-bold text-gray-700">{aud.segment}</span>
                </div>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{aud.size}</span>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      {/* Market Momentum Section */}
      <DashboardCard 
        title="Growth Momentum" 
        subtitle="Trajectory intelligence & velocity"
        className="w-full"
        id="market-trends"
      >
        <div className="h-64 mt-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.marketSize} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="lineArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="#14B8A6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis 
                dataKey="year" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#9CA3AF', fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#9CA3AF', fontWeight: 600 }}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                  padding: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#14B8A6" 
                strokeWidth={4} 
                dot={{ r: 0 }}
                activeDot={{ r: 6, fill: '#14B8A6', stroke: '#fff', strokeWidth: 3 }}
                animationDuration={2000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="research-swot">
        {/* SWOT Analysis */}
        <DashboardCard title="Strategic SWOT" subtitle="Internal & External factors">
          <div className="grid grid-cols-2 gap-4 mt-8">
            <SWOTItem title="Strengths" items={data.swot.strengths} className="bg-brand-purple/5 text-brand-purple" icon={<Zap size={14}/>} />
            <SWOTItem title="Weaknesses" items={data.swot.weaknesses} className="bg-red-50 text-red-600" icon={<AlertTriangle size={14}/>} />
            <SWOTItem title="Opportunities" items={data.swot.opportunities} className="bg-brand-teal/5 text-brand-teal" icon={<Lightbulb size={14}/>} />
            <SWOTItem title="Threats" items={data.swot.threats} className="bg-orange-50 text-orange-600" icon={<ShieldCheck size={14}/>} />
          </div>
        </DashboardCard>

        {/* Competitor Analysis */}
        <DashboardCard title="Competition Matrix" subtitle="Key players and vulnerabilities">
          <div className="mt-8">
             <div className="grid grid-cols-12 gap-4 px-4 mb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <div className="col-span-4">Competitor</div>
                <div className="col-span-4">Strength</div>
                <div className="col-span-4 text-right">Vulnerability</div>
             </div>
             <div className="space-y-2">
              {data.competitors.map((comp, i) => (
                <div key={i} className="p-4 border border-gray-100 rounded-2xl grid grid-cols-12 gap-4 items-center group hover:border-brand-purple/30 transition-all hover:bg-gray-50/50">
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-400 group-hover:bg-brand-purple/10 group-hover:text-brand-purple transition-all">
                      {comp.name.charAt(0)}
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 truncate">{comp.name}</h4>
                  </div>
                  <div className="col-span-4">
                    <span className="text-[10px] font-bold text-brand-teal bg-brand-teal/5 px-2 py-1 rounded-md">{comp.strength}</span>
                  </div>
                  <div className="col-span-4 text-right">
                    <div className="text-[10px] font-bold text-gray-500">{comp.weakness}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}

function StatCard({ label, value, trend, icon, color }: { label: string, value: string, trend: string, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
      <div className="flex justify-between items-start z-10">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
        <div className={`p-2 bg-${color}/10 rounded-xl text-${color} text-brand-purple`}>{icon}</div>
      </div>
      <div className="z-10">
        <h4 className="text-2xl font-bold text-gray-900 mb-1">{value}</h4>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-brand-teal">{trend}</span>
          <span className="text-[10px] font-bold text-gray-300">increased</span>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, subtitle, children, className = "", id }: { title: string, subtitle?: string, children: React.ReactNode, className?: string, id?: string }) {
  return (
    <div id={id} className={cn("bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm scroll-mt-24", className)}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-gray-900">{title}</h3>
        <div className="flex gap-2">
          <button className="p-2 border border-gray-100 rounded-xl text-gray-400 hover:text-gray-900 transition-all"><TrendingUp size={14} /></button>
        </div>
      </div>
      {subtitle && <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{subtitle}</p>}
      {children}
    </div>
  );
}

function SWOTItem({ title, items, className, icon }: { title: string, items: string[], className: string, icon: React.ReactNode }) {
  return (
    <div className={cn("p-4 rounded-2xl flex flex-col gap-2", className)}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">{title}</span>
      </div>
      <ul className="space-y-1">
        {items.slice(0, 2).map((item, i) => (
          <li key={i} className="text-[9px] font-bold leading-tight opacity-80">— {item}</li>
        ))}
      </ul>
    </div>
  );
}
