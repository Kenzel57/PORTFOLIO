const links = [
  { label: "PROJECTS", href: "/work" },
  { label: "About Me", href: "/about" },
];

const big =
  "block text-[clamp(1.75rem,9vw,3rem)] font-black uppercase leading-[0.8] tracking-tighter [font-stretch:125%] md:text-[clamp(2.5rem,6.5vw,6.5rem)]";

const small = "hidden text-[clamp(0.7rem,1vw,1.1rem)] font-bold md:mt-2 md:block";

export default function NameMark() {
  return (
    <div className="absolute inset-x-0 bottom-0 flex justify-between px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:bottom-auto md:top-0 md:items-start md:px-4 md:pb-0 md:pt-3">
      <h1 className="sr-only">By Kenzel</h1>

      {/* Left column: BY + Film Director */}
      <div aria-hidden="true" className="flex flex-col">
        <span className={big}>By</span>
        <span className={small}>Film Director</span>
      </div>

      {/* Right column: KENZEL + nav, pushed to the right edge with a tight gap */}
      <div className="flex flex-col">
        <span aria-hidden="true" className={big}>
          Kenzel
        </span>
        <nav className="pointer-events-auto hidden text-[clamp(0.7rem,1vw,1.1rem)] font-bold md:mt-2 md:flex md:justify-end md:gap-[clamp(1rem,2vw,2.5rem)]">
          {links.map((l) => (
            <a key={l.label} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}