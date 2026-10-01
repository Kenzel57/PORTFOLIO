export default function WorkHeader() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-end px-5 pt-6 font-bold uppercase text-white mix-blend-difference md:px-8 md:pt-8">
      {/* logo spot intentionally empty */}
      <a
        href="/about"
        className="pointer-events-auto text-2xl leading-none md:text-4xl"
      >
        About Kenzel 
      </a>
    </header>
  );
}