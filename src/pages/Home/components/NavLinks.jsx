export default function NavLinks() {
  return (
    <header className="absolute inset-x-0 top-0 flex items-start justify-between px-3 pt-3 text-base font-bold leading-tight sm:text-xl md:hidden">
      <div>
        By Kenzel
        <br />
        Film Director
      </div>
      <a href="/work" className="pointer-events-auto">
        PROJECTS
      </a>
    </header>
  );
}