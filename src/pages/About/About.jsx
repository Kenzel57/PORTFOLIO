import { useEffect } from "react";
import { FaInstagram, FaTiktok, FaWhatsapp, FaFacebookF } from "react-icons/fa6";
import { about } from "./data/about";

const ICONS = {
  instagram: FaInstagram,
  tiktok: FaTiktok,
  whatsapp: FaWhatsapp,
  facebook: FaFacebookF,
};

const SERVICES = ["Weddings", "Concerts", "Hotels", "Brand films", "Music videos", "Events"];

// Film grain laid over the photos
const grain = {
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
};

const AMBER = "#ffb000";
const pad = (n) => String(n).padStart(2, "0");

// 90s camcorder-style date stamp, e.g. '97  8  14
const stamp = (n) => `'9${(n * 3 + 4) % 10}  ${(n * 5) % 12 + 1}  ${(n * 7) % 28 + 1}`;

// Column of sprocket holes. Four holes per frame, so they scroll with the film.
function Band({ frames }) {
  return (
    <div className="flex w-5 shrink-0 flex-col bg-[#120a04] md:w-6" aria-hidden="true">
      {Array.from({ length: frames * 4 }).map((_, n) => (
        <div
          key={n}
          className="flex h-[calc(var(--fh)/4)] items-center justify-center"
        >
          <span className="block h-3.5 w-2.5 rounded-[3px] bg-white md:h-4 md:w-3" />
        </div>
      ))}
    </div>
  );
}

function FilmStrip({ images }) {
  const reel = [...images, ...images]; // doubled so the loop has no seam
  const secondsPerFrame = 4.5;

  return (
    <div className="kz-strip relative overflow-hidden bg-[#120a04] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.6)] [--fh:15rem] md:[--fh:19rem] h-[72svh] md:h-[calc(100svh-4rem)]">
      <div
        className="kz-reel flex"
        style={{ animationDuration: `${images.length * secondsPerFrame}s` }}
      >
        <Band frames={reel.length} />

        <div className="min-w-0 flex-1">
          {reel.map((src, n) => {
            const k = n % images.length;
            return (
              <div
                key={n}
                className="flex h-[var(--fh)] flex-col px-1.5 pt-2 pb-1"
              >
                <div className="relative min-h-0 flex-1 overflow-hidden rounded-[2px] bg-neutral-900">
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                    style={{
                      filter: "sepia(0.28) saturate(1.25) contrast(1.06) brightness(1.02)",
                    }}
                  />
                  {/* warm colour cast */}
                  <div
                    className="pointer-events-none absolute inset-0 bg-amber-600/15 mix-blend-multiply"
                    aria-hidden="true"
                  />
                  {/* grain */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-overlay"
                    style={grain}
                    aria-hidden="true"
                  />
                  {/* camcorder date stamp */}
                  <span
                    className="pointer-events-none absolute bottom-2 right-2 font-mono text-[0.7rem] font-bold tracking-widest md:text-xs"
                    style={{ color: AMBER, textShadow: "0 0 6px rgba(255,140,0,.8)" }}
                    aria-hidden="true"
                  >
                    {stamp(k)}
                  </span>
                </div>

                {/* edge print between frames */}
                <div
                  className="flex items-center justify-between pt-1 font-mono text-[0.6rem] font-bold tracking-widest md:text-[0.65rem]"
                  style={{ color: AMBER }}
                  aria-hidden="true"
                >
                  <span>▶ {pad(k + 1)}</span>
                  <span>KENZEL 400</span>
                  <span>{pad(k + 1)}A</span>
                </div>
              </div>
            );
          })}
        </div>

        <Band frames={reel.length} />
      </div>

      {/* light leak, like a cheap camera */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse at 100% 0%, rgba(255,120,30,0.35), transparent 55%), radial-gradient(ellipse at 0% 100%, rgba(255,60,60,0.18), transparent 50%)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}

function Block({ title, children }) {
  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold text-black/50">{title}</h2>
      {children}
    </div>
  );
}

function Marquee() {
  const row = [...SERVICES, ...SERVICES];
  return (
    <div className="overflow-hidden bg-black py-5 text-white" aria-hidden="true">
      <div className="kz-marquee flex w-max items-center gap-10 whitespace-nowrap">
        {[...row, ...row].map((s, n) => (
          <span key={n} className="flex items-center gap-10">
            <span className="text-[clamp(1.75rem,4.5vw,4rem)] font-black uppercase leading-none tracking-tighter [font-stretch:125%]">
              {s}
            </span>
            <span className="font-[family-name:var(--font-script)] text-[clamp(2rem,5vw,4.5rem)] leading-none">
              and
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function About() {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("page-scroll", "page-light");
    return () => html.classList.remove("page-scroll", "page-light");
  }, []);

  const [lead, ...rest] = about.paragraphs;

  return (
    <main className="min-h-screen bg-white text-black">
      <style>{`
        @keyframes kz-marquee { to { transform: translateX(-50%); } }
        @keyframes kz-reel { to { transform: translateY(-50%); } }
        @keyframes kz-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
        @keyframes kz-flicker {
          0%, 100% { opacity: 1; }
          47% { opacity: 1; }
          50% { opacity: .94; }
          53% { opacity: 1; }
        }
        .kz-marquee { animation: kz-marquee 32s linear infinite; }
        .kz-reel { animation: kz-reel 40s linear infinite; will-change: transform; }
        .kz-strip { animation: kz-flicker 3s steps(1) infinite; }
        .kz-strip:hover .kz-reel { animation-play-state: paused; }
        .kz-draw { stroke-dasharray: 1; stroke-dashoffset: 1; animation: kz-draw 1.2s 0.7s ease-out forwards; }
        @media (prefers-reduced-motion: reduce) {
          .kz-marquee, .kz-reel, .kz-strip { animation: none; }
          .kz-draw { animation: none; stroke-dashoffset: 0; }
        }
      `}</style>

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-x-10 gap-y-14 px-4 pb-24 pt-8 md:grid-cols-12 md:px-8">
        {/* Film strip: bottom of the page on phones, sticky left column on desktop */}
        <div className="order-2 md:order-1 md:col-span-5">
          <div className="md:sticky md:top-8">
            <FilmStrip images={about.images} />
          </div>
        </div>

        {/* Story: first on phones, right column on desktop */}
        <div className="order-1 md:order-2 md:col-span-7 md:pl-6 lg:pl-14">
          <div aria-hidden="true">
            <p className="-rotate-3 font-[family-name:var(--font-script)] text-[clamp(4.5rem,13vw,11rem)] leading-[0.8] md:-ml-2">
              Hello
            </p>
            <svg viewBox="0 0 300 20" className="mt-3 w-[min(60%,22rem)]" fill="none">
              <path
                className="kz-draw"
                pathLength="1"
                d="M2 12 C 30 2, 50 22, 80 12 S 130 2, 160 12 S 210 22, 240 12 S 280 4, 298 10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <p className="mt-10 max-w-[30ch] text-[clamp(1.6rem,3.2vw,2.75rem)] font-bold leading-[1.1] tracking-tight [font-stretch:110%]">
            {lead}
          </p>

          <div className="mt-10 max-w-[56ch] space-y-5 border-l-2 border-black pl-5 text-lg leading-relaxed text-black/70">
            {rest.map((p, n) => (
              <p
                key={n}
                className={
                  n === rest.length - 1
                    ? "font-[family-name:var(--font-script)] text-5xl leading-none text-black md:text-6xl"
                    : ""
                }
              >
                {p}
              </p>
            ))}
          </div>

          {/* Portrait: black and white on desktop, colour on hover */}
          <div className="group relative mt-16 overflow-hidden">
            <img
              src={about.portrait}
              alt="Kenzel"
              loading="lazy"
              className="aspect-[3/2] w-full object-cover transition-all duration-700 ease-out md:grayscale md:group-hover:scale-[1.03] md:group-hover:grayscale-0"
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
              style={grain}
              aria-hidden="true"
            />
            <span
              className="pointer-events-none absolute bottom-3 right-5 -rotate-6 font-[family-name:var(--font-script)] text-5xl text-white mix-blend-difference md:text-7xl"
              aria-hidden="true"
            >
              on set
            </span>
          </div>

          <div className="mt-16 grid gap-10 border-t-2 border-black pt-8 sm:grid-cols-2">
            <Block title="Contact">
              <ul className="space-y-1 text-xl font-semibold">
                {about.contact.map((c) => (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      className="underline decoration-black/25 underline-offset-4 transition-all hover:decoration-2 hover:decoration-black focus-visible:decoration-black"
                    >
                      {c.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Block>

            <Block title="Represented by">
              <ul className="space-y-1 text-xl font-semibold">
                {about.representedBy.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </Block>

            <div className="sm:col-span-2">
              <Block title="Follow">
                <ul className="flex flex-wrap gap-3">
                  {about.socials.map((s) => {
                    const Icon = ICONS[s.icon];
                    return (
                      <li key={s.name}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={s.name}
                          className="flex h-14 w-14 items-center justify-center rounded-full border border-black text-xl transition-all duration-300 hover:-rotate-12 hover:scale-110 hover:bg-black hover:text-white focus-visible:bg-black focus-visible:text-white focus-visible:outline-none"
                        >
                          {Icon && <Icon />}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </Block>
            </div>
          </div>
        </div>
      </div>

      <Marquee />

      <footer className="overflow-hidden">
        <p
          className="whitespace-nowrap px-4 py-6 text-center text-[clamp(3rem,15vw,15rem)] font-black uppercase leading-[0.85] tracking-tighter [font-stretch:125%] md:px-8"
          aria-hidden="true"
        >
          By Kenzel
        </p>
      </footer>
    </main>
  );
}