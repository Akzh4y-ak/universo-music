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
  
  // Mock data that "updates" for effect
  const [visitorCount, setVisitorCount] = useState(1248);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-8 pb-12">
      <Helmet>
        <title>Admin Insights - Univerzo Music</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header */}
      <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-brand animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-brand">Live Insights</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">Admin Portal</h1>
          <p className="mt-2 text-text-subdued text-lg">Real-time performance and audience metrics.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <a 
            href="https://vercel.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white/5 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/10"
          >
            Vercel Dashboard <ExternalLink className="h-4 w-4" />
          </a>
          <button className="rounded-full bg-brand px-8 py-3 text-sm font-black text-black transition-transform hover:scale-105 active:scale-95">
            Export Report
          </button>
        </div>
      </section>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Visitors" 
          value={visitorCount.toLocaleString()} 
          change="+12.5%" 
          icon={Users} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Avg. Session" 
          value="4m 32s" 
          change="+2.1%" 
          icon={Activity} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Top Region" 
          value="India" 
          icon={Globe} 
          color="bg-purple-500" 
        />
        <StatCard 
          title="API Health" 
          value="99.9%" 
          icon={Zap} 
          color="bg-amber-500" 
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Activity Chart Mock */}
        <div className="lg:col-span-2 rounded-[32px] border border-white/10 bg-white/5 p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-brand" />
              Traffic Overview
            </h3>
            <select className="bg-transparent text-xs font-bold uppercase tracking-widest text-text-subdued outline-none">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          
          <div className="flex h-64 items-end gap-2 px-2">
            {[45, 62, 58, 85, 72, 90, 65, 55, 80, 95, 70, 40].map((height, i) => (
              <div 
                key={i} 
                className="flex-1 bg-gradient-to-t from-brand/20 to-brand/80 rounded-t-lg transition-all hover:opacity-100 opacity-60" 
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-text-subdued uppercase tracking-widest">
            <span>12:00 AM</span>
            <span>06:00 AM</span>
            <span>12:00 PM</span>
            <span>06:00 PM</span>
            <span>11:59 PM</span>
          </div>
        </div>

        {/* System Status */}
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-brand" />
            Infrastructure
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Database className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">LocalStorage</p>
                  <p className="text-xs text-text-subdued">Preference Engine</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400">ACTIVE</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Music className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">JioSaavn API</p>
                  <p className="text-xs text-text-subdued">Music Provider</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400">OPTIMAL</span>
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-brand/10 border border-brand/20">
               <p className="text-xs font-bold text-brand uppercase tracking-widest mb-1">Admin Note</p>
               <p className="text-xs text-text-subdued leading-relaxed">
                 Real-time user event tracking is powered by Vercel Analytics. Visit the Vercel Dashboard for exact unique visitor counts.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
