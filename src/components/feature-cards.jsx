import { Globe, Zap, Users, Code } from "lucide-react";

export function FeatureCards() {
  const features = [
    {
      number: "01",
      title: "Forever Free",
      description: "We believe a great idea shouldn't come with a price tag. There are no hidden fees or subscriptions—your domain is completely free, forever.",
      icon: Globe,
      bg: "#FFD23F"
    },
    {
      number: "02",
      title: "Full DNS Control",
      description: "Take the wheel with complete DNS management. Whether you need A, CNAME, or TXT records, you have the flexibility to point your domain exactly where you need it.",
      icon: Code,
      bg: "#FF6B35"
    },
    {
      number: "03",
      title: "Growing Community",
      description: "You're in good company. Join thousands of developers, makers, and students who have already found the perfect home for their personal projects.",
      icon: Users,
      bg: "#2D5016"
    },
    {
      number: "04",
      title: "Instant Setup",
      description: "Get up and running in seconds. Just log in with GitHub, pick your favorite name, and let our reliable, lightning-fast infrastructure handle the rest.",
      icon: Zap,
      bg: "#FFD23F"
    }
  ];

  return (
    <section className="w-full bg-transparent relative min-h-screen flex items-center">
      <div className="w-full px-6 md:px-12 lg:px-16 max-w-[1600px] mx-auto py-16 md:py-20">

        <div className="mb-16 md:mb-20 space-y-6 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            The price of admission <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">is zero.</span>
          </h2>

          <div className="space-y-4 text-base md:text-lg text-slate-900 dark:text-white opacity-90 leading-relaxed font-medium">
            <p>
              For too long, gatekeepers have put a price tag on your identity. We believe your first
              idea, your tenth side project, and your portfolio deserve a home, not a monthly bill.
            </p>
            <p>
              <span className="font-semibold text-slate-900 dark:text-white">Stackryze Domains</span> is our contribution to the chaotic, beautiful mess that is the open web.
              Claim your domain, point it anywhere, and deploy. No strings attached.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white/60 dark:bg-white/5 backdrop-blur-lg border border-slate-200/60 dark:border-white/10 rounded-[2rem] p-8 h-full shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-500 ease-out flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-8">
                  <span className="text-4xl lg:text-5xl font-black text-slate-200 dark:text-white/20 transition-colors duration-500 group-hover:text-slate-300 dark:group-hover:text-white/40">
                    {feature.number}
                  </span>
                  <div
                    className="w-14 h-14 flex items-center justify-center rounded-xl ring-1 ring-black/5 shadow-sm transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundColor: `${feature.bg}15`, color: feature.bg }}
                  >
                    <feature.icon className="w-7 h-7" strokeWidth={2} />
                  </div>
                </div>

                <h3 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-slate-900 dark:text-white opacity-80 text-base leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
