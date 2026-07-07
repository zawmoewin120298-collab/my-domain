import { Globe3D } from "./ui/3d-globe";

const sampleMarkers = [
  {
    lat: 40.7128,
    lng: -74.006,
    src: "https://assets.aceternity.com/avatars/1.webp",
    label: "New York",
  },
  {
    lat: 51.5074,
    lng: -0.1278,
    src: "https://assets.aceternity.com/avatars/2.webp",
    label: "London",
  },
  {
    lat: 35.6762,
    lng: 139.6503,
    src: "https://assets.aceternity.com/avatars/3.webp",
    label: "Tokyo",
  },
  {
    lat: -33.8688,
    lng: 151.2093,
    src: "https://assets.aceternity.com/avatars/4.webp",
    label: "Sydney",
  },
  {
    lat: 48.8566,
    lng: 2.3522,
    src: "https://assets.aceternity.com/avatars/5.webp",
    label: "Paris",
  },
  {
    lat: 28.6139,
    lng: 77.209,
    src: "https://assets.aceternity.com/avatars/6.webp",
    label: "New Delhi",
  },
  {
    lat: 55.7558,
    lng: 37.6173,
    src: "https://assets.aceternity.com/avatars/7.webp",
    label: "Moscow",
  },
  {
    lat: -22.9068,
    lng: -43.1729,
    src: "https://assets.aceternity.com/avatars/8.webp",
    label: "Rio de Janeiro",
  },
  {
    lat: 31.2304,
    lng: 121.4737,
    src: "https://assets.aceternity.com/avatars/9.webp",
    label: "Shanghai",
  },
  {
    lat: 25.2048,
    lng: 55.2708,
    src: "https://assets.aceternity.com/avatars/10.webp",
    label: "Dubai",
  },
  {
    lat: -34.6037,
    lng: -58.3816,
    src: "https://assets.aceternity.com/avatars/11.webp",
    label: "Buenos Aires",
  },
  {
    lat: 1.3521,
    lng: 103.8198,
    src: "https://assets.aceternity.com/avatars/12.webp",
    label: "Singapore",
  },
  {
    lat: 37.5665,
    lng: 126.978,
    src: "https://assets.aceternity.com/avatars/13.webp",
    label: "Seoul",
  },
];

export function Globe3DDemoThird() {
  return (
    <div
      className="relative mx-auto h-[450px] w-full max-w-4xl overflow-hidden rounded-xl bg-white dark:bg-[#111] border border-slate-200 dark:border-[#27272a] shadow-xl flex flex-col items-center pt-8 md:pt-12">
      <div className="relative z-10 text-center px-6">
        <h2
          className="mb-2 text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl">
          All over the world
        </h2>
        <p
          className="max-w-md mx-auto text-sm text-neutral-500 md:text-base">
          Meet our distributed team of experts working across 6 continents.
        </p>
      </div>
      {/* Globe container - centered and peeking out from the bottom */}
      <div
        className="absolute -bottom-64 left-1/2 -translate-x-1/2 z-10 w-[36rem] h-[36rem] md:-bottom-72 md:w-[42rem] md:h-[42rem]">
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
            console.log("Clicked marker:", marker.label);
          }}
          onMarkerHover={(marker) => {
            if (marker) {
              console.log("Hovering:", marker.label);
            }
          }} />
      </div>
    </div>
  );
}
