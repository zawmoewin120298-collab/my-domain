import { Header } from "@/components/header";
import { Footer } from "@/components/footer-section";

export function LegalLayout({ children, title, date }) {
    return (
        <div className="flex flex-col min-h-screen w-full bg-transparent">
            <Header />
            <main className="flex-1 w-full pt-[calc(8rem+var(--incident-height,0px))] pb-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
                        {title}
                    </h1>
                    {date && (
                        <p className="text-slate-500 dark:text-slate-400 mb-12 font-mono text-base md:text-lg border-b border-slate-200/80 dark:border-white/10 pb-8">
                            Last Updated: {date}
                        </p>
                    )}
                    <div className="
                        [&_h3]:text-2xl [&_h3]:md:text-3xl [&_h3]:font-bold [&_h3]:text-slate-900 dark:[&_h3]:text-white [&_h3]:mt-12 [&_h3]:mb-6
                        [&_p]:text-lg [&_p]:md:text-xl [&_p]:text-slate-600 dark:[&_p]:text-slate-200 [&_p]:leading-relaxed [&_p]:mb-6
                        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-8 [&_ul]:space-y-3 [&_ul]:text-lg [&_ul]:md:text-xl [&_ul]:text-slate-600 dark:[&_ul]:text-slate-200
                        [&_li]:pl-2
                        [&_.lead]:text-xl [&_.lead]:md:text-2xl [&_.lead]:font-medium [&_.lead]:text-slate-900 dark:[&_.lead]:text-white [&_.lead]:mb-10
                        [&_a]:text-[#FF6B35] [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-2
                        [&_strong]:font-bold [&_strong]:text-slate-900 dark:[&_strong]:text-white
                    ">
                        {children}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
