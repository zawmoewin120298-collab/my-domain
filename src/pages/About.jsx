import { Header } from "@/components/header";
import { Footer } from "@/components/footer-section";
import {
    Heart,
    Globe,
    Code,
    Github,
    Users,
    Shield,
    Mail
} from "lucide-react";

export function About() {
    return (
        <div className="min-h-screen bg-transparent">
            <Header />

            {/* Hero Section */}
            <section className="pt-[calc(8rem+var(--incident-height,0px))] pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white text-xs font-medium uppercase tracking-widest mb-6 border border-slate-200 dark:border-white/10">
                        <Heart className="w-3.5 h-3.5 text-[#FF6B35]" />
                        <span>A Stackryze Initiative</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
                        Giving back to the <br className="hidden md:block" />
                        <span className="text-[#FF6B35]">developer community</span>.
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-200 max-w-2xl mx-auto leading-relaxed">
                        Stackryze Domains (Indevs) is our way of empowering builders. Free, open-source, and forever reliable.
                    </p>
                </div>
            </section>

            {/* The Why & Values */}
            <section className="py-16 px-6 border-y border-slate-100 dark:border-white/5 bg-transparent">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Why we built this</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-200 mb-6 leading-relaxed">
                            At <strong className="text-slate-900 dark:text-white">Stackryze</strong>, we know the struggle of finding a professional domain for a hackathon project, a portfolio, or a quick demo.
                        </p>
                        <p className="text-lg text-slate-600 dark:text-slate-200 mb-6 leading-relaxed">
                            We believe that cost shouldn't be a barrier to shipping code. That's why we built this platform—to provide free <code className="text-slate-900 dark:text-white">.indevs.in</code> subdomains to anyone who needs them. No credit cards, no hidden fees.
                        </p>
                        <a
                            href="https://github.com/stackryze/FreeDomains"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 font-bold text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white hover:text-[#FF6B35] dark:hover:text-[#FF6B35] hover:border-[#FF6B35] dark:hover:border-[#FF6B35] transition-colors"
                        >
                            <Github className="w-4 h-4" />
                            Check out the code
                        </a>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-white/5 p-8 rounded-[24px] border border-slate-200/80 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 transition-all">
                            <Code className="w-8 h-8 text-slate-900 dark:text-white mb-5" />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Open Source</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-200 leading-relaxed">Transparent infrastructure. Audit, contribute, or fork it.</p>
                        </div>
                        <div className="bg-white dark:bg-white/5 p-8 rounded-[24px] border border-slate-200/80 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 transition-all">
                            <Users className="w-8 h-8 text-slate-900 dark:text-white mb-5" />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Community</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-200 leading-relaxed">Built by developers, for developers. Maintained by volunteers.</p>
                        </div>
                        <div className="bg-white dark:bg-white/5 p-8 rounded-[24px] border border-slate-200/80 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 transition-all">
                            <Shield className="w-8 h-8 text-slate-900 dark:text-white mb-5" />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Secure</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-200 leading-relaxed">Zero tolerance for abuse. We keep the namespace clean.</p>
                        </div>
                        <div className="bg-white dark:bg-white/5 p-8 rounded-[24px] border border-slate-200/80 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 transition-all">
                            <Globe className="w-8 h-8 text-slate-900 dark:text-white mb-5" />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Accessible</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-200 leading-relaxed">Democratizing web identities for students and creators.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact & Community */}
            <section className="py-20 px-6 border-t border-slate-100 dark:border-white/5">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8">Contact & Community</h2>
                    <p className="text-xl text-slate-600 dark:text-slate-200 mb-10">
                        Have questions, suggestions, or want to collaborate?
                    </p>
                    <div className="flex flex-col md:flex-row justify-center gap-6 mb-16">
                        <a href="mailto:support@stackryze.com" className="flex items-center justify-center gap-4 text-lg font-medium text-slate-900 dark:text-white bg-white dark:bg-white/5 px-8 py-4 border border-slate-200/80 dark:border-white/10 rounded-2xl hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-sm">
                            <Mail className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                            support@stackryze.com
                        </a>
                        <a href="mailto:reportabuse@stackryze.com" className="flex items-center justify-center gap-4 text-lg font-medium text-slate-900 dark:text-white bg-white dark:bg-white/5 px-8 py-4 border border-slate-200/80 dark:border-white/10 rounded-2xl hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-sm">
                            <Shield className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                            reportabuse@stackryze.com
                        </a>
                    </div>

                    <div className="bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200/80 dark:border-white/5 rounded-[24px] p-8 max-w-2xl mx-auto text-center relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10"></div>
                        <h3 className="font-medium text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-sm">Official Communication Channels</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-md mx-auto mb-6">
                            <div className="font-mono text-slate-600 dark:text-slate-200 text-sm">support@stackryze.com</div>
                            <div className="font-mono text-slate-600 dark:text-slate-200 text-sm">reportabuse@stackryze.com</div>
                            <div className="font-mono text-slate-600 dark:text-slate-200 text-sm">security@stackryze.com</div>
                            <div className="font-mono text-slate-600 dark:text-slate-200 text-sm">no-reply@stackryze.com</div>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-300 italic">
                            We will never contact you from any other domain or prefix.
                        </p>
                    </div>

                    <p className="text-sm text-slate-500 dark:text-slate-300 mt-16">
                        Maintained by <a href="https://stackryze.com" target="_blank" rel="noreferrer" className="font-bold text-slate-900 dark:text-white hover:underline">Stackryze</a>
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
}
