import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { SponsorsSection } from "@/components/sponsors-section";
import { MissionSection } from "@/components/mission-section";
import { FeatureCards } from "@/components/feature-cards";
import { Footer } from "@/components/footer-section";
import { DomainExtensionsSection } from "@/components/domain-extensions";
import { LiveStatsSection } from "@/components/live-stats";


export function Landing() {
    return (
        <div className="flex flex-col min-h-screen w-full">
            <Header />
            <div style={{ height: 'calc(4rem + var(--incident-height, 0px))' }}></div>

            <main className="flex-1 w-full flex flex-col bg-transparent">
                <HeroSection />

                {/* Divider */}
                <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-8">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                </div>

                <SponsorsSection />

                {/* Divider */}
                <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-8">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                </div>

                <MissionSection />

                {/* Divider */}
                <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-8">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                </div>

                <FeatureCards />

                {/* Divider */}
                <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-8">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                </div>

                <section className="w-full bg-transparent relative overflow-hidden z-30 pt-4 md:pt-8 pb-6 md:pb-8">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-slate-100 dark:hidden blur-[100px] rounded-full pointer-events-none opacity-50"></div>

                    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 relative z-10">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-8 items-center">
                            <DomainExtensionsSection />
                            <LiveStatsSection />
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-8">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-16 md:mb-24"></div>

                    <div className="flex flex-col items-center justify-center text-center pb-24 md:pb-32 px-4 relative z-10">
                        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.02)_0%,transparent_70%)]"></div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 max-w-4xl">
                            Launch your next project today.
                        </h2>
                        <p className="text-lg md:text-xl text-slate-900 dark:text-white opacity-80 max-w-2xl mx-auto mb-10 font-medium">
                            Claim a free subdomain, configure your DNS, and deploy anywhere. Trusted by developers for fast, flexible, and reliable domain management.
                        </p>
                        <a
                            href="/login"
                            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-lg hover:bg-neutral-800 dark:hover:bg-slate-200 transition-all duration-300 shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1"
                        >
                            Get Started
                        </a>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
}
