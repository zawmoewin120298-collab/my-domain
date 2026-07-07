import { Globe, Plus, Settings, Clock, CheckCircle, ArrowRight, Search, History, Shield } from "lucide-react";
import { useDashboard } from "@/context/dashboard-context";
import { useAuth } from "@/context/auth-context";
import { Link } from "react-router-dom";

export default function Overview() {
    const { subdomains, loading } = useDashboard();
    const { user } = useAuth();

    const totalCount = subdomains.length;
    const activeCount = subdomains.filter(d => d.status === "Active").length;
    const expiringCount = subdomains.filter(d => {
        if (!d.expiresAt) return false;
        const days = Math.ceil((new Date(d.expiresAt) - new Date()) / 864e5);
        return days > 0 && days <= 30;
    }).length;
    const expiredCount = subdomains.filter(d => d.status === "Expired").length;

    // Most recently created domains (up to 3)
    const recentDomains = [...subdomains]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return "Good morning";
        if (h < 17) return "Good afternoon";
        return "Good evening";
    };

    if (loading && subdomains.length === 0) {
        return (
            <div className="max-w-5xl animate-pulse space-y-6">
                <div className="h-8 bg-[#E5E3DF] rounded-lg w-48" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-[#E5E3DF] rounded-2xl" />)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-[#E5E3DF] rounded-2xl" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl space-y-6">

            {/* ── Greeting header ── */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#FF6B35] mb-1">Dashboard</p>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] dark:text-white leading-tight">
                        {greeting()}, {user?.name?.split(" ")[0] || "there"} 👋
                    </h1>
                    <p className="text-sm text-slate-900 dark:text-white mt-1">
                        {totalCount === 0 ? "Register your first free domain to get started." : `You have ${totalCount} domain${totalCount > 1 ? "s" : ""} on Stackryze.`}
                    </p>
                </div>
                <Link
                    to="/register"
                    className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-sm font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Register Domain
                </Link>
            </div>

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <StatCard
                    value={totalCount}
                    label="Total"
                    sub="domains"
                    accentClass="text-slate-900 dark:text-white"
                    dot="#FFD23F"
                    to="/my-domains"
                />
                <StatCard
                    value={activeCount}
                    label="Active"
                    sub="running"
                    accentClass="text-green-600 dark:text-green-400"
                    dot="#4ade80"
                    to="/my-domains"
                />
                <StatCard
                    value={expiringCount}
                    label="Expiring"
                    sub="within 30 days"
                    accentClass={expiringCount > 0 ? "text-amber-600 dark:text-amber-400" : "text-slate-900 dark:text-white"}
                    dot={expiringCount > 0 ? "#fbbf24" : "#D1D5DB"}
                    to="/my-domains"
                    warn={expiringCount > 0}
                />
                <StatCard
                    value={expiredCount}
                    label="Expired"
                    sub="domains"
                    accentClass={expiredCount > 0 ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-white"}
                    dot={expiredCount > 0 ? "#f87171" : "#D1D5DB"}
                    to="/my-domains"
                />
            </div>

            {/* ── KYC / GitHub verification status ── */}
            {user?.githubVerified ? (
                <div className="flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-green-800 dark:text-green-300">KYC Verified</p>
                        <p className="text-xs text-green-600 dark:text-green-400/80">GitHub identity verified — you have access to sryze.cc, ryzedns.org & nx.kg domains & higher limits</p>
                    </div>
                    <span className="shrink-0 text-xs font-bold px-2.5 py-1 bg-green-600 dark:bg-green-500/20 text-white dark:text-green-400 rounded-full">Verified</span>
                </div>
            ) : (
                <a
                    href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/github/kyc/start`}
                    className="group flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl hover:border-amber-300 dark:hover:border-amber-500/40 transition-colors cursor-pointer"
                >
                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-amber-900 dark:text-amber-200">KYC Not Verified</p>
                        <p className="text-xs text-amber-700 dark:text-amber-400/80">Complete GitHub verification to unlock sryze.cc, ryzedns.org &amp; nx.kg domains and extra limits</p>
                    </div>
                    <span className="shrink-0 text-xs font-bold px-2.5 py-1 border border-amber-400 dark:border-amber-500/50 text-amber-700 dark:text-amber-400 rounded-full group-hover:bg-amber-400 group-hover:text-white dark:group-hover:bg-amber-500 dark:group-hover:text-amber-950 transition-colors">
                        Verify →
                    </span>
                </a>
            )}

            {/* ── Main grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Manage Domains */}
                <ActionCard
                    to="/my-domains"
                    icon={Globe}
                    iconBg="bg-green-50 dark:bg-green-500/10"
                    iconColor="text-green-600 dark:text-green-400"
                    title="Manage Domains"
                    desc="View, renew, or delete your existing domains"
                />

                {/* DNS Config */}
                <ActionCard
                    to="/dns"
                    icon={Settings}
                    iconBg="bg-orange-50 dark:bg-orange-500/10"
                    iconColor="text-orange-600 dark:text-orange-400"
                    title="DNS Configuration"
                    desc="Set up NS delegation and manage DNS records"
                />

                {/* WHOIS Lookup */}
                <ActionCard
                    to="/whois"
                    icon={Search}
                    iconBg="bg-blue-50 dark:bg-blue-500/10"
                    iconColor="text-blue-600 dark:text-blue-400"
                    title="WHOIS Lookup"
                    desc="Look up registration info for any domain"
                    external={false}
                />

                {/* History */}
                <ActionCard
                    to="/history"
                    icon={History}
                    iconBg="bg-amber-50 dark:bg-amber-500/10"
                    iconColor="text-amber-600 dark:text-amber-400"
                    title="Activity History"
                    desc="Track changes, renewals, and domain events"
                />
            </div>

            {/* ── Recent domains ── */}
            {recentDomains.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white">Recent Domains</h2>
                        <Link to="/my-domains" className="text-xs font-bold text-slate-900 dark:text-white hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors">
                            View all <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {recentDomains.map(d => (
                            <Link
                                key={d._id}
                                to={`/domains/${d._id}`}
                                className="flex items-center justify-between px-4 py-3 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 rounded-xl hover:shadow-sm transition-all group"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center flex-shrink-0">
                                        <Globe className="w-4 h-4 text-slate-900 dark:text-white" />
                                    </div>
                                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white truncate">
                                        {d.name}.{d.domain}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <StatusPill status={d.status} />
                                    <ArrowRight className="w-4 h-4 text-slate-900 dark:text-white group-hover:text-slate-900 dark:text-white dark:group-hover:text-slate-200 group-hover:translate-x-1 transition-all" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Empty state ── */}
            {totalCount === 0 && !loading && (
                <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-8 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <div className="w-14 h-14 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Globe className="w-7 h-7 text-white dark:text-slate-900" />
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">Register your first domain 🎉</h3>
                    <p className="text-sm text-slate-900 dark:text-white mb-5 max-w-sm mx-auto">
                        It's free, instant, and takes under a minute. Get a personal <strong>.indevs.in</strong>, <strong>.sryze.cc</strong>, <strong>.ryzedns.org</strong>, or <strong>.nx.kg</strong> subdomain.
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-sm rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Register Now — It's Free
                    </Link>
                </div>
            )}
        </div>
    );
}

function StatCard({ value, label, sub, accentClass, dot, to, warn }) {
    return (
        <Link
            to={to}
            className={`bg-white/60 dark:bg-white/5 backdrop-blur-lg border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 md:p-5 hover:shadow-md transition-all duration-300 group ${warn ? "border-amber-300/80 dark:border-amber-500/30" : ""}`}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
                    <span className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">{label}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-900 dark:text-white group-hover:text-slate-900 dark:text-white dark:group-hover:text-slate-200 transition-colors" />
            </div>
            <p className={`text-3xl md:text-4xl font-bold leading-none mt-3 ${accentClass}`}>{value}</p>
            <p className="text-sm text-slate-900 dark:text-white mt-1">{sub}</p>
        </Link>
    );
}

function ActionCard({ to, icon: Icon, iconBg, iconColor, title, desc }) {
    return (
        <Link
            to={to}
            className="bg-white/60 dark:bg-white/5 backdrop-blur-lg border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all duration-300 group"
        >
            <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-bold text-base text-slate-900 dark:text-white">{title}</p>
                <p className="text-sm text-slate-900 dark:text-white mt-0.5 truncate">{desc}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-900 dark:text-white group-hover:text-slate-900 dark:text-white dark:group-hover:text-slate-200 group-hover:translate-x-1 transition-all flex-shrink-0" />
        </Link>
    );
}

function StatusPill({ status }) {
    const map = {
        Active:          { bg: "bg-green-50 dark:bg-green-500/10",  text: "text-green-700 dark:text-green-400",  dot: "bg-green-500" },
        Expired:         { bg: "bg-red-50 dark:bg-red-500/10",    text: "text-red-600 dark:text-red-400",    dot: "bg-red-400" },
        Suspended:       { bg: "bg-red-50 dark:bg-red-500/10",    text: "text-red-600 dark:text-red-400",    dot: "bg-red-400" },
        "Pending Deletion": { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-400" },
        "Pending DNS":   { bg: "bg-blue-50 dark:bg-blue-500/10",   text: "text-blue-700 dark:text-blue-400",   dot: "bg-blue-400" },
    };
    const s = map[status] || { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-900 dark:text-white", dot: "bg-slate-400" };
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {status}
        </span>
    );
}
