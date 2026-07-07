import { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer-section";
import { DashboardProvider } from "@/context/dashboard-context";
import {
    LayoutDashboard,
    Globe,
    BarChart3,
    Settings,
    HelpCircle,
    LogOut,
    Plus,
    Heart,
    Server,
    Menu,
    X,
    Clock,
    Search
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

const SidebarItem = ({ to, icon: Icon, label, active, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-300 text-sm ${active
            ? "bg-slate-900 dark:bg-white/10 text-white shadow-sm"
            : "text-slate-900 dark:text-white hover:bg-slate-900/5 dark:hover:bg-white/5"
            }`}
    >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span>{label}</span>
    </Link>
);

export default function DashboardLayout() {
    const location = useLocation();
    const { logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    // Close sidebar when route changes (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [sidebarOpen]);

    const SidebarContent = () => (
        <>
            <div className="p-6 space-y-2 overflow-y-auto flex-1">
                <SidebarItem
                    to="/dashboard"
                    icon={LayoutDashboard}
                    label="Overview"
                    active={isActive("/dashboard")}
                    onClick={() => setSidebarOpen(false)}
                />
                <SidebarItem
                    to="/my-domains"
                    icon={Globe}
                    label="My Domains"
                    active={isActive("/my-domains")}
                    onClick={() => setSidebarOpen(false)}
                />
                <SidebarItem
                    to="/dns"
                    icon={Server}
                    label="DNS Records"
                    active={isActive("/dns")}
                    onClick={() => setSidebarOpen(false)}
                />
                <SidebarItem
                    to="/register"
                    icon={Plus}
                    label="Register Domain"
                    active={isActive("/register")}
                    onClick={() => setSidebarOpen(false)}
                />
                <SidebarItem
                    to="/history"
                    icon={Clock}
                    label="History"
                    active={isActive("/history")}
                    onClick={() => setSidebarOpen(false)}
                />
                <SidebarItem
                    to="/whois"
                    icon={Search}
                    label="WHOIS Lookup"
                    active={isActive("/whois")}
                    onClick={() => setSidebarOpen(false)}
                />
                <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 my-2"></div>
                {/* Analytics placeholder */}
                <div className="opacity-50 pointer-events-none">
                    <SidebarItem to="#" icon={BarChart3} label="Analytics (Soon)" active={false} />
                </div>
                <SidebarItem
                    to="/profile"
                    icon={Settings}
                    label="Settings"
                    active={isActive("/profile")}
                    onClick={() => setSidebarOpen(false)}
                />
                <SidebarItem
                    to="/donate"
                    icon={Heart}
                    label="Donate"
                    active={isActive("/donate")}
                    onClick={() => setSidebarOpen(false)}
                />
                <SidebarItem
                    to="/help"
                    icon={HelpCircle}
                    label="Help & Support"
                    active={isActive("/help")}
                    onClick={() => setSidebarOpen(false)}
                />
            </div>

            <div className="p-6 border-t border-slate-200/80 dark:border-white/10 bg-transparent">
                <button
                    onClick={() => {
                        setSidebarOpen(false);
                        logout();
                    }}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-bold text-red-600 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors text-sm"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                </button>
            </div>
        </>
    );

    return (
        <DashboardProvider>
            <div className="min-h-screen bg-transparent font-sans flex flex-col">
                <Header />

                {/* Mobile Hamburger Button */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="md:hidden fixed top-[calc(5rem+var(--incident-height,0px))] left-4 z-50 p-2 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-all"
                    aria-label="Toggle menu"
                >
                    {sidebarOpen ? (
                        <X className="w-6 h-6 text-slate-900 dark:text-white" />
                    ) : (
                        <Menu className="w-6 h-6 text-slate-900 dark:text-white" />
                    )}
                </button>

                {/* Mobile Backdrop */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <div className="flex flex-1 pt-[calc(4rem+var(--incident-height,0px))]">
                    {/* Desktop Sidebar */}
                    <aside className="w-64 bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-r border-slate-200/80 dark:border-white/10 hidden md:flex md:flex-col fixed top-[calc(4rem+var(--incident-height,0px))] h-[calc(100vh-4rem-var(--incident-height,0px))] z-10">
                        <SidebarContent />
                    </aside>

                    {/* Mobile Sidebar */}
                    <aside
                        className={`fixed top-[var(--incident-height,0px)] left-0 h-[calc(100vh-var(--incident-height,0px))] w-64 bg-white/80 dark:bg-[#111]/80 backdrop-blur-2xl border-r border-slate-200/80 dark:border-white/10 z-40 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                            }`}
                    >
                        {/* Mobile sidebar header with close button */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-200/80 dark:border-white/10 mt-16">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Menu</h2>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-2 hover:bg-slate-900/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-900 dark:text-white" />
                            </button>
                        </div>
                        <SidebarContent />
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 md:ml-64 p-4 sm:p-6 md:p-10 pt-16 md:pt-6 mb-20 overflow-y-auto min-h-[calc(100vh-64px)]">
                        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500">
                            <Outlet />
                        </div>
                    </main>
                </div>

                <div className="md:ml-64">
                    <Footer />
                </div>
            </div>
        </DashboardProvider>
    );
}
