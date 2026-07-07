import { Globe2, Sparkles, Server, Zap } from "lucide-react";

export function DomainExtensionsSection() {
  const extensions = [
    {
      ext: ".indevs.in",
      description: "Empowering innovation with accessible, secure, and trusted digital identities for developers, organizations, and communities.",
      icon: Globe2,
      accent: "from-blue-500 to-indigo-500",
      iconColor: "text-blue-500",
      bgHover: "hover:bg-blue-50/50"
    },
    {
      ext: ".sryze.cc",
      description: "A modern namespace for creators, entrepreneurs, and digital-first brands seeking memorable online identities.",
      icon: Sparkles,
      accent: "from-orange-400 to-red-500",
      iconColor: "text-orange-500",
      bgHover: "hover:bg-orange-50/50"
    },
    {
      ext: ".ryzedns.org",
      description: "Supporting self-hosted infrastructure, open-source ecosystems, and network services with dependable naming solutions.",
      icon: Server,
      accent: "from-emerald-400 to-teal-500",
      iconColor: "text-emerald-500",
      bgHover: "hover:bg-emerald-50/50"
    },
    {
      ext: ".nx.kg",
      description: "A concise namespace built for the next generation of applications, platforms, and internet services.",
      icon: Zap,
      accent: "from-purple-500 to-pink-500",
      iconColor: "text-purple-500",
      bgHover: "hover:bg-purple-50/50"
    }
  ];

  return (
    <div className="w-full relative z-10 flex flex-col justify-center h-full">
      <div className="mb-8 md:mb-12 space-y-2 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Available Namespaces
        </h2>
        <p className="max-w-xl mx-auto text-sm md:text-base text-slate-900 dark:text-white opacity-80 leading-relaxed font-medium">
          Four unique extensions. Infinite possibilities. Claim yours instantly.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 w-full xl:w-fit mx-auto">
        {extensions.map((item, idx) => (
          <div
            key={idx}
            title={item.description}
            className={`group flex items-center justify-center md:justify-start gap-2 md:gap-3 bg-white/60 dark:bg-white/5 backdrop-blur-lg border border-slate-200/60 dark:border-white/10 px-4 py-3 md:px-6 md:py-3.5 rounded-2xl md:rounded-[2rem] shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-500 ease-out cursor-help ${item.bgHover}`}
          >
            <item.icon className={`w-4 h-4 md:w-5 md:h-5 ${item.iconColor} transition-transform duration-300 group-hover:scale-110 shrink-0`} strokeWidth={2.5} />
            <span className="text-base md:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              {item.ext}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
