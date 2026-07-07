import { useEffect, useState } from "react";
import { Activity, Globe2, ShieldCheck, Users } from "lucide-react";

export function LiveStatsSection() {
  const [stats, setStats] = useState({
    activeDomains: "46,000+",
    totalUsers: "25,000+",
    countries: "120+",
    nameservers: "3"
  });

  useEffect(() => {
    // Attempt to fetch live stats from the backend
    const fetchStats = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/public/stats`);
        if (response.ok) {
          const data = await response.json();
          setStats(prev => ({
            ...prev,
            activeDomains: data.totalDomains > 46000 ? data.totalDomains.toLocaleString() : "46,000+",
            totalUsers: data.totalUsers > 25000 ? `${data.totalUsers.toLocaleString()}+` : "25,000+",
          }));
        }
      } catch {
        // Keep defaults
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    { label: "Users", value: stats.totalUsers, icon: Users, iconColor: "text-emerald-600 dark:text-emerald-400", iconBg: "bg-emerald-50 dark:bg-emerald-500/10" },
    { label: "Domains", value: stats.activeDomains, icon: Globe2, iconColor: "text-blue-600 dark:text-blue-400", iconBg: "bg-blue-50 dark:bg-blue-500/10" },
    { label: "Countries", value: stats.countries, icon: Activity, iconColor: "text-amber-600 dark:text-amber-400", iconBg: "bg-amber-50 dark:bg-amber-500/10" },
    { label: "Global Nameservers", value: stats.nameservers, icon: ShieldCheck, iconColor: "text-indigo-600 dark:text-indigo-400", iconBg: "bg-indigo-50 dark:bg-indigo-500/10" }
  ];

  return (
    <div className="w-full relative flex flex-col justify-center h-full">
      <div className="mb-8 md:mb-12 space-y-2 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Trusted by developers <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-700">worldwide</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 w-full xl:w-fit mx-auto">
        {statItems.map((stat, idx) => (
          <div
            key={idx}
            className="group bg-white/60 dark:bg-white/5 backdrop-blur-lg border border-slate-200/60 dark:border-white/10 rounded-2xl md:rounded-[2rem] px-4 py-3 md:px-5 md:py-3.5 flex flex-col md:flex-row items-center justify-center text-center md:text-left gap-2 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-500 ease-out cursor-default"
          >
            <div className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full ${stat.iconBg} ${stat.iconColor} shadow-sm transition-transform duration-500 ease-out group-hover:scale-110 shrink-0`}>
              <stat.icon className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-baseline gap-0.5 md:gap-1.5">
              <span className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                {stat.value}
              </span>
              <span className={`${stat.iconColor} text-[10px] md:text-xs font-extrabold uppercase tracking-wider`}>
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
