import { Fragment, lazy, Suspense } from "react";
import { Terminal, ShieldCheck, Eye, Users, Key, Server, Database, Globe } from "lucide-react";

const Globe3D = lazy(() => import('./ui/3d-globe').then(m => ({ default: m.Globe3D })));

const sampleMarkers = [
  // North America
  { lat: 40.7128, lng: -74.006, label: "New York" },
  { lat: 34.0522, lng: -118.2437, label: "Los Angeles" },
  { lat: 41.8781, lng: -87.6298, label: "Chicago" },
  { lat: 47.6062, lng: -122.3321, label: "Seattle" },
  { lat: 43.6532, lng: -79.3832, label: "Toronto" },
  { lat: 37.7749, lng: -122.4194, label: "San Francisco" },
  { lat: 25.7617, lng: -80.1918, label: "Miami" },
  { lat: 38.9072, lng: -77.0369, label: "Washington DC" },
  { lat: 42.3601, lng: -71.0589, label: "Boston" },
  { lat: 32.7767, lng: -96.7970, label: "Dallas" },
  { lat: 29.7604, lng: -95.3698, label: "Houston" },
  { lat: 39.7392, lng: -104.9903, label: "Denver" },
  { lat: 33.4484, lng: -112.0740, label: "Phoenix" },
  { lat: 19.4326, lng: -99.1332, label: "Mexico City" },
  { lat: 49.2827, lng: -123.1207, label: "Vancouver" },
  { lat: 45.5017, lng: -73.5673, label: "Montreal" },
  { lat: 33.7490, lng: -84.3880, label: "Atlanta" },

  // Europe
  { lat: 51.5074, lng: -0.1278, label: "London" },
  { lat: 48.8566, lng: 2.3522, label: "Paris" },
  { lat: 50.1109, lng: 8.6821, label: "Frankfurt" },
  { lat: 52.3676, lng: 4.9041, label: "Amsterdam" },
  { lat: 41.9028, lng: 12.4964, label: "Rome" },
  { lat: 40.4168, lng: -3.7038, label: "Madrid" },
  { lat: 55.7558, lng: 37.6173, label: "Moscow" },
  { lat: 52.5200, lng: 13.4050, label: "Berlin" },
  { lat: 48.1351, lng: 11.5820, label: "Munich" },
  { lat: 48.2082, lng: 16.3738, label: "Vienna" },
  { lat: 47.3769, lng: 8.5417, label: "Zurich" },
  { lat: 45.4642, lng: 9.1900, label: "Milan" },
  { lat: 37.9838, lng: 23.7275, label: "Athens" },
  { lat: 52.2297, lng: 21.0122, label: "Warsaw" },
  { lat: 50.0755, lng: 14.4378, label: "Prague" },
  { lat: 59.3293, lng: 18.0686, label: "Stockholm" },
  { lat: 59.9139, lng: 10.7522, label: "Oslo" },
  { lat: 55.6761, lng: 12.5683, label: "Copenhagen" },
  { lat: 38.7223, lng: -9.1393, label: "Lisbon" },
  { lat: 41.3851, lng: 2.1734, label: "Barcelona" },
  { lat: 53.3498, lng: -6.2603, label: "Dublin" },
  { lat: 55.9533, lng: -3.1883, label: "Edinburgh" },
  { lat: 50.4501, lng: 30.5234, label: "Kyiv" },

  // Asia - India (Densely populated)
  { lat: 28.6139, lng: 77.209, label: "New Delhi" },
  { lat: 19.0760, lng: 72.8777, label: "Mumbai" },
  { lat: 12.9716, lng: 77.5946, label: "Bangalore" },
  { lat: 17.3850, lng: 78.4867, label: "Hyderabad" },
  { lat: 13.0827, lng: 80.2707, label: "Chennai" },
  { lat: 22.5726, lng: 88.3639, label: "Kolkata" },
  { lat: 18.5204, lng: 73.8567, label: "Pune" },
  { lat: 23.0225, lng: 72.5714, label: "Ahmedabad" },
  { lat: 26.9124, lng: 75.7873, label: "Jaipur" },
  { lat: 21.1702, lng: 72.8311, label: "Surat" },
  { lat: 26.8467, lng: 80.9462, label: "Lucknow" },
  { lat: 26.4499, lng: 80.3319, label: "Kanpur" },
  { lat: 21.1458, lng: 79.0882, label: "Nagpur" },
  { lat: 22.7196, lng: 75.8577, label: "Indore" },
  { lat: 23.2599, lng: 77.4126, label: "Bhopal" },
  { lat: 17.6868, lng: 83.2185, label: "Visakhapatnam" },
  { lat: 25.5941, lng: 85.1376, label: "Patna" },
  { lat: 22.3072, lng: 73.1812, label: "Vadodara" },
  { lat: 28.6692, lng: 77.4538, label: "Ghaziabad" },
  { lat: 30.9010, lng: 75.8573, label: "Ludhiana" },
  { lat: 27.1767, lng: 78.0081, label: "Agra" },
  { lat: 25.3176, lng: 82.9739, label: "Varanasi" },
  { lat: 15.2993, lng: 74.1240, label: "Goa" },
  { lat: 11.0168, lng: 76.9558, label: "Coimbatore" },
  { lat: 9.9312, lng: 76.2673, label: "Kochi" },

  // Asia - Other
  { lat: 35.6762, lng: 139.6503, label: "Tokyo" },
  { lat: 31.2304, lng: 121.4737, label: "Shanghai" },
  { lat: 22.3193, lng: 114.1694, label: "Hong Kong" },
  { lat: 37.5665, lng: 126.9780, label: "Seoul" },
  { lat: 1.3521, lng: 103.8198, label: "Singapore" },
  { lat: 13.7563, lng: 100.5018, label: "Bangkok" },
  { lat: 25.2048, lng: 55.2708, label: "Dubai" },
  { lat: 39.9042, lng: 116.4074, label: "Beijing" },
  { lat: 22.5431, lng: 114.0579, label: "Shenzhen" },
  { lat: 25.0330, lng: 121.5654, label: "Taipei" },
  { lat: 34.6937, lng: 135.5023, label: "Osaka" },
  { lat: 14.5995, lng: 120.9842, label: "Manila" },
  { lat: 10.8231, lng: 106.6297, label: "Ho Chi Minh City" },
  { lat: 3.1390, lng: 101.6869, label: "Kuala Lumpur" },
  { lat: 23.8103, lng: 90.4125, label: "Dhaka" },
  { lat: 24.8607, lng: 67.0011, label: "Karachi" },
  { lat: 24.7136, lng: 46.6753, label: "Riyadh" },
  { lat: 25.2854, lng: 51.5310, label: "Doha" },
  { lat: 32.0853, lng: 34.7818, label: "Tel Aviv" },

  // South America
  { lat: -23.5505, lng: -46.6333, label: "Sao Paulo" },
  { lat: -22.9068, lng: -43.1729, label: "Rio de Janeiro" },
  { lat: -34.6037, lng: -58.3816, label: "Buenos Aires" },
  { lat: -33.4489, lng: -70.6693, label: "Santiago" },
  { lat: 4.7110, lng: -74.0721, label: "Bogota" },
  { lat: -12.0464, lng: -77.0428, label: "Lima" },
  { lat: 10.4806, lng: -66.9036, label: "Caracas" },
  { lat: -15.8267, lng: -47.9218, label: "Brasilia" },
  { lat: -0.1807, lng: -78.4678, label: "Quito" },

  // Africa
  { lat: -33.9249, lng: 18.4241, label: "Cape Town" },
  { lat: 30.0444, lng: 31.2357, label: "Cairo" },
  { lat: -1.2921, lng: 36.8219, label: "Nairobi" },
  { lat: 6.5244, lng: 3.3792, label: "Lagos" },
  { lat: -26.2041, lng: 28.0473, label: "Johannesburg" },
  { lat: 5.6037, lng: -0.1870, label: "Accra" },
  { lat: 33.5731, lng: -7.5898, label: "Casablanca" },
  { lat: 9.0227, lng: 38.7468, label: "Addis Ababa" },
  { lat: 36.8065, lng: 10.1815, label: "Tunis" },

  // Oceania
  { lat: -33.8688, lng: 151.2093, label: "Sydney" },
  { lat: -37.8136, lng: 144.9631, label: "Melbourne" },
  { lat: -36.8485, lng: 174.7633, label: "Auckland" },
  { lat: -27.4698, lng: 153.0251, label: "Brisbane" },
  { lat: -31.9505, lng: 115.8605, label: "Perth" },
  { lat: -41.2865, lng: 174.7762, label: "Wellington" },
  { lat: -43.5321, lng: 172.6362, label: "Christchurch" }
];

const features = [
  {
    icon: Terminal,
    title: "Developer Friendly",
    subtitle: "Built for builders",
    description: "Manage records through our intuitive dashboard or automate workflows via API. Bring your own nameservers, integrate with your preferred hosting providers, and stay in complete control.",
    accent: "#3b82f6", // blue
  },
  {
    icon: ShieldCheck,
    title: "Abuse & Safety",
    subtitle: "Protecting the namespace",
    description: "Automated detection systems and a dedicated Abuse & Safety team actively investigate and remove phishing, malware, spam, and other malicious activity. Repeat offenders are permanently removed from the platform.",
    accent: "#ef4444", // red
  },
  {
    icon: Eye,
    title: "Transparency",
    subtitle: "Clear policies, fair decisions",
    description: "Abuse reports are handled through a transparent and documented process. Enforcement actions are guided by published policies, with fair appeal options available to legitimate users.",
    accent: "#10b981", // emerald
  },
  {
    icon: Users,
    title: "For Communities",
    subtitle: "Perfect for growing ideas",
    description: "Whether you're building an open-source project, student organization, non-profit initiative, community platform, or personal portfolio, Stackryze Domains provides a trusted foundation to get started.",
    accent: "#f59e0b", // amber
  },
  {
    icon: Key,
    title: "Ownership & Control",
    subtitle: "Your domain, your choice",
    description: "Use our native DNS platform or connect to external providers such as Cloudflare. No vendor lock-in, no forced services—just complete control over your domain and records.",
    accent: "#8b5cf6", // violet
  },
  {
    icon: Server,
    title: "Infrastructure",
    subtitle: "Reliable by design",
    description: "Powered by globally distributed infrastructure with continuous monitoring, redundancy, and high availability to ensure dependable DNS performance and rapid resolution worldwide.",
    accent: "#64748b", // slate
  },
  {
    icon: Database,
    title: "Data Protection",
    subtitle: "Privacy through resilience",
    description: "Your data is protected across self-hosted, geographically distributed systems designed for security, reliability, and long-term resilience. We minimize dependencies and prioritize user trust at every layer.",
    accent: "#06b6d4", // cyan
  },
  {
    icon: Globe,
    title: "Open Internet",
    subtitle: "Access without gatekeepers",
    description: "We believe everyone deserves access to a trustworthy online identity. By lowering barriers to entry while maintaining strong security standards, we help make the internet more open, accessible, and empowering for all.",
    accent: "#d946ef", // fuchsia
  }
];

export function MissionSection() {
  return (
    <section className="w-full bg-transparent" style={{ overflow: 'clip' }}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 pt-8 pb-10 md:pt-10 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start relative">

          {/* Left: Scrollable Stacked Content */}
          <div className="relative pb-0">

            {[
              { isIntro: true },
              ...Array.from({ length: Math.ceil(features.length / 2) }, (_, i) => ({
                isIntro: false,
                items: features.slice(i * 2, i * 2 + 2)
              }))
            ].map((block, idx, arr) => (
              <Fragment key={idx}>
                <div
                  className="sticky w-full bg-[#F5F5F5] dark:bg-[#1A1A1A] pt-8 pb-8 min-h-[65vh] top-[15vh] lg:top-[35vh]"
                  style={{
                    zIndex: 10 + idx
                  }}
                >
                  <div className="relative z-10 bg-[#F5F5F5] dark:bg-[#1A1A1A] pr-4">
                    {block.isIntro ? (
                      <>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-6">
                          Who are we?
                        </h2>
                        <div className="space-y-4 text-slate-900 dark:text-white opacity-90 text-base md:text-lg leading-relaxed font-medium">
                          <p>
                            We are a small team of passionate developers building an open, accessible, and community-driven namespace for the modern internet.
                          </p>
                          <p>
                            Providing completely free domain names for open-source projects, communities, and individuals to launch ideas without financial barriers.
                          </p>
                          <p>
                            Enjoy fast and simple domain management, robust built-in security with automated abuse prevention, and absolutely zero hidden fees or upsells.
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col gap-10">
                        {block.items.map((f, i) => (
                          <div key={i} className="flex gap-6 items-start">
                            <div
                              className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ring-1 ring-slate-100 shadow-sm mt-1"
                              style={{ backgroundColor: `${f.accent}15`, color: f.accent }}
                            >
                              <f.icon className="w-8 h-8" strokeWidth={2} />
                            </div>
                            <div className="space-y-2 flex-1">
                              <div>
                                <h3 className="text-slate-900 dark:text-white font-extrabold text-2xl md:text-3xl tracking-tight">{f.title}</h3>
                                <p className="text-xs font-extrabold uppercase tracking-wider mt-1" style={{ color: f.accent }}>{f.subtitle}</p>
                              </div>
                              <p className="text-slate-900 dark:text-white opacity-80 text-base md:text-lg leading-relaxed font-medium">
                                {f.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* White Tail to hide previous content */}
                  {idx < arr.length - 1 && (
                    <div className="absolute top-full left-0 right-0 h-[150vh] bg-[#F5F5F5] dark:bg-[#1A1A1A] pointer-events-none z-0"></div>
                  )}
                </div>
                {idx < arr.length - 1 && (
                  <div className="h-[50vh] w-full pointer-events-none" />
                )}
              </Fragment>
            ))}

          </div>

          {/* Right: Floating Globe Illustration (Sticky) */}
          <div
            className="hidden lg:flex flex-col items-center lg:items-end justify-center w-full lg:sticky pb-32 lg:pb-0"
            style={{
              top: "35vh",
              height: "65vh"
            }}
          >
            {/* Heading above the globe */}
            <div className="w-full max-w-[600px] text-center mb-4 lg:mb-8 relative z-50">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Connecting the world
              </h2>
            </div>

            <div className="relative w-full max-w-[600px] h-[600px] flex items-center justify-center mt-[-40px]">
              {/* Subtle background glow */}
              <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

              {/* The Globe */}
              <div className="relative z-10 w-full h-full">
                <Suspense fallback={<div className="w-full h-full animate-pulse bg-slate-200/50 dark:bg-white/5 rounded-full" />}>
                  <Globe3D
                    className="h-full w-full"
                    markers={sampleMarkers}
                    config={{
                      textureUrl: "https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg",
                      showAtmosphere: false,
                      bumpScale: 1.0,
                      autoRotateSpeed: 0.4,
                    }}
                    onMarkerClick={(marker) => {
                      if (import.meta.env.DEV) console.log("Clicked:", marker.label);
                    }}
                  />
                </Suspense>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
