import { useState, useEffect } from 'react';
import { 
  Users, 
  BarChart3, 
  Activity, 
  Globe, 
  ArrowUpRight, 
  ShieldCheck, 
  Database,
  ExternalLink,
  Music,
  Zap
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
    <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10 blur-2xl ${color}`} />
    <div className="flex items-center justify-between">
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-opacity-10 ${color.replace('bg-', 'text-')} ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
      {change && (
        <span className="flex items-center gap-1 text-xs font-bold text-brand">
          <ArrowUpRight className="h-3 w-3" />
          {change}
        </span>
      )}
    </div>
    <div className="mt-4">
      <p className="text-sm font-medium text-text-subdued">{title}</p>
      <h3 className="text-3xl font-black text-white">{value}</h3>
    </div>
  </div>
);

const AdminPortal = () => {
  const [isLive, setIsLive] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data that "updates" for effect
  const [visitorCount, setVisitorCount] = useState(1248);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col lg:flex-row overflow-hidden font-sans">
      <Helmet>
        <title>Admin Dashboard | Univerzo Insights</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Standalone Sidebar */}
      <aside className="w-full lg:w-72 bg-[#0a0a0a] border-r border-white/5 flex flex-col p-6 z-50">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="h-10 w-10 bg-brand rounded-xl flex items-center justify-center">
            <Activity className="text-black h-6 w-6" />
          </div>
          <div>
            <h2 className="font-black text-xl tracking-tight">INSIGHTS</h2>
            <p className="text-[10px] font-bold text-brand uppercase tracking-widest">Admin Control</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'audience', label: 'Audience', icon: Users },
            { id: 'system', label: 'System Health', icon: ShieldCheck },
            { id: 'geo', label: 'Geography', icon: Globe },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === item.id ? 'bg-brand text-black shadow-[0_0_20px_rgba(30,215,96,0.2)]' : 'text-text-subdued hover:bg-white/5 hover:text-white'}`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <a 
            href="/" 
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-text-subdued hover:text-white transition-colors"
          >
            <ExternalLink className="h-5 w-5" />
            Back to Webapp
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12 relative">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-2 w-2 rounded-full bg-brand animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-brand">System Online</span>
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">Dashboard Overview</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <a 
                href="https://vercel.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 rounded-2xl bg-white/5 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/10"
              >
                Vercel Ops <ExternalLink className="h-4 w-4" />
              </a>
              <button className="rounded-2xl bg-white px-8 py-3 text-sm font-black text-black transition-transform hover:scale-105 active:scale-95 shadow-xl">
                Generate Report
              </button>
            </div>
          </section>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Total Sessions" 
              value={visitorCount.toLocaleString()} 
              change="+14.2%" 
              icon={Users} 
              color="bg-blue-500" 
            />
            <StatCard 
              title="Real-time Active" 
              value={Math.floor(visitorCount / 42).toString()} 
              change="Live" 
              icon={Activity} 
              color="bg-emerald-500" 
            />
            <StatCard 
              title="Page Performance" 
              value="98/100" 
              change="Excellent"
              icon={Zap} 
              color="bg-amber-500" 
            />
            <StatCard 
              title="Uptime" 
              value="100%" 
              icon={ShieldCheck} 
              color="bg-purple-500" 
            />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Chart Area */}
            <div className="lg:col-span-2 rounded-[32px] border border-white/5 bg-[#0a0a0a] p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-bold text-white">Engagement Pulse</h3>
                <div className="flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-brand" />
                  <span className="h-3 w-3 rounded-full bg-white/10" />
                </div>
              </div>
              
              <div className="flex h-64 items-end gap-3 px-2">
                {[30, 45, 60, 40, 75, 90, 85, 70, 50, 65, 80, 55].map((height, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-gradient-to-t from-brand/5 to-brand rounded-t-xl transition-all hover:brightness-125 cursor-pointer" 
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-6 text-[10px] font-bold text-text-subdued uppercase tracking-widest px-1">
                <span>MON</span>
                <span>TUE</span>
                <span>WED</span>
                <span>THU</span>
                <span>FRI</span>
                <span>SAT</span>
                <span>SUN</span>
              </div>
            </div>

            {/* Quick Actions / System */}
            <div className="space-y-6">
              <div className="rounded-[32px] border border-white/5 bg-[#0a0a0a] p-8 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6">Service Status</h3>
                <div className="space-y-5">
                  {[
                    { label: 'Content Delivery', status: 'Healthy', color: 'text-emerald-400' },
                    { label: 'Music API Node', status: 'Operational', color: 'text-emerald-400' },
                    { label: 'Analytics Pipeline', status: 'Active', color: 'text-emerald-400' },
                    { label: 'PWA Manifest', status: 'Cached', color: 'text-blue-400' },
                  ].map((s) => (
                    <div key={s.label} className="flex justify-between items-center py-1">
                      <span className="text-sm font-medium text-text-subdued">{s.label}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${s.color}`}>{s.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] bg-gradient-to-br from-brand/20 to-brand/5 border border-brand/20 p-8">
                 <h4 className="text-brand font-black text-xs uppercase tracking-[0.2em] mb-3">Admin Intelligence</h4>
                 <p className="text-sm text-white/70 leading-relaxed font-medium">
                   Your current SEO strategy has indexed 50+ unique entry points. Visit Vercel Analytics for direct search engine referral data.
                 </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPortal;
