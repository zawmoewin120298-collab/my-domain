import { Heart, Github, Star, Share2, Bug, Code2 } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer-section";

const ways = [
    { icon: Star,    label: "Star on GitHub",    href: "https://github.com/stackryze/FreeDomains", desc: "Helps us get discovered" },
    { icon: Share2,  label: "Share with friends", href: null,                                        desc: "Spread the word" },
    { icon: Bug,     label: "Report bugs",        href: "https://github.com/stackryze/FreeDomains/issues", desc: "Improve the platform" },
    { icon: Code2,   label: "Contribute code",    href: "https://github.com/stackryze/FreeDomains", desc: "Open source PRs welcome" },
];

export function Donate() {
    return (
        <div className="min-h-screen bg-transparent font-sans flex flex-col relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/20 rounded-full blur-[120px] pointer-events-none"></div>

            <Header />

            <main className="flex-1 flex items-center justify-center px-4 pt-[calc(6rem+var(--incident-height,0px))] pb-16 relative z-10 w-full">
                <div className="w-full max-w-lg space-y-8 animate-in fade-in zoom-in-95 duration-500">

                    {/* Icon + heading */}
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-slate-200/80 dark:border-white/20 flex items-center justify-center mx-auto shadow-xl relative">
                            <div className="absolute inset-0 bg-orange-500/30 blur-xl rounded-2xl animate-pulse"></div>
                            <Heart className="w-8 h-8 text-orange-500 fill-orange-500 relative z-10" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Support Stackryze</h1>
                            <p className="text-sm text-slate-900 dark:text-white font-medium max-w-sm mx-auto leading-relaxed">
                                It costs ~$20/month to keep this running — funded personally by a student. Your support keeps it free for everyone.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-3xl border border-slate-200/80 dark:border-white/10 rounded-[28px] p-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>

                        {/* Primary: GitHub Sponsors */}
                        <a
                            href="https://github.com/sponsors/sudheerbhuvana"
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center justify-center gap-3 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-base py-4 rounded-xl hover:scale-[1.02] transition-all shadow-md hover:shadow-orange-500/25 relative overflow-hidden mb-5"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <Github className="w-5 h-5 relative z-10 group-hover:text-white transition-colors" />
                            <span className="relative z-10 group-hover:text-white transition-colors">Sponsor on GitHub</span>
                            <Heart className="w-4 h-4 fill-orange-500 text-orange-500 relative z-10 group-hover:fill-white group-hover:text-white transition-colors" />
                        </a>

                        <p className="text-center text-xs font-bold text-slate-900 dark:text-white mb-6">Even $1 makes a real difference ❤️</p>

                        {/* Divider */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900 dark:text-white">Other ways to help</span>
                            <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
                        </div>

                        {/* Secondary ways to help */}
                        <div className="grid grid-cols-2 gap-3">
                            {ways.map(({ icon: Icon, label, href, desc }) => {
                                const cls = "bg-white/80 dark:bg-white/10 backdrop-blur-md border border-slate-200/80 dark:border-white/10 rounded-xl p-4 flex flex-col gap-2 hover:scale-[1.02] hover:bg-slate-50 dark:hover:bg-white/20 hover:border-slate-300 dark:hover:border-white/30 transition-all text-left shadow-sm";
                                const inner = (
                                    <>
                                        <div className="w-10 h-10 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-md">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-900 dark:text-white">{label}</p>
                                            <p className="text-xs font-medium text-slate-900 dark:text-white mt-1 opacity-80">{desc}</p>
                                        </div>
                                    </>
                                );
                                return href
                                    ? <a key={label} href={href} target="_blank" rel="noreferrer" className={cls}>{inner}</a>
                                    : <div key={label} className={cls}>{inner}</div>;
                            })}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
