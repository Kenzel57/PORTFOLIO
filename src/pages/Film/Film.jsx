import { useEffect, useMemo } from "react";
import { categories } from "../Projects/data/categories";
import { getFilm } from "../Category/data/films";
import useSlowConnection from "../Home/hooks/useSlowConnection";
import GalleryTile from "./components/GalleryTile";

export default function Film({ slug, n }) {
  const dataSaver = useSlowConnection();
  const cat = categories.find((c) => c.slug === slug);
  const film = useMemo(() => (cat ? getFilm(cat, n) : null), [cat, n]);

  // normal page scrolling, same opt-in class as the other pages
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("page-scroll");
    window.scrollTo(0, 0);
    return () => html.classList.remove("page-scroll");
  }, []);

  useEffect(() => {
    if (film) document.title = `${film.title} | By Kenzel`;
  }, [film]);

  if (!film) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <a href="/work">Back to work</a>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Back link */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-5 pt-5 text-xs font-bold uppercase text-white mix-blend-difference md:px-8 md:pt-7">
        <a href={`/work/${cat.slug}`} className="pointer-events-auto">
          &larr; {cat.title}
        </a>
      </header>

      {/* Title block */}
      <section className="px-4 pb-6 pt-20 text-center md:pb-8 md:pt-24">
        <h1 className="text-[clamp(1.25rem,2.4vw,2rem)] leading-tight text-[#e5201f]">
          <em className="font-bold">{film.title}</em> - {film.type}
          {film.year ? ` (${film.year})` : ""}
        </h1>
        <p className="mt-1 text-[10px] font-bold text-neutral-300">
          {film.credit}
        </p>
        {film.award && (
          <p className="mt-6 text-[9px] font-bold text-sky-300/80">
            {film.award}
          </p>
        )}
      </section>

      {/* The film */}
      <section className="mx-auto w-full max-w-[1100px] px-0 md:px-4">
        <div className="aspect-video w-full bg-neutral-900">
          <video
            key={film.video}
            src={film.video}
            poster={film.poster}
            controls
            playsInline
            preload={dataSaver ? "none" : "metadata"}
            controlsList="nodownload"
            className="h-full w-full bg-black object-contain"
          />
        </div>
      </section>

      {/* Stills and short shots from this film (hidden until you add some) */}
      {film.gallery.length > 0 && (
        <section className="mx-auto mt-10 grid w-full max-w-[1100px] grid-cols-1 gap-x-14 gap-y-1.5 px-4 sm:grid-cols-2 md:mt-14">
          {film.gallery.map((item, i) => (
            <GalleryTile key={i} item={item} dataSaver={dataSaver} />
          ))}
        </section>
      )}

      {/* Previous / next film (only when the category has more than one) */}
      {film.hasSiblings && (
        <nav className="mx-auto mt-16 flex max-w-[1100px] justify-between px-4 text-[11px] font-bold uppercase text-neutral-500 md:text-xs">
          <a
            href={`/work/${cat.slug}/${film.prev.n}`}
            className="transition-colors hover:text-white"
          >
            &larr; {film.prev.n} {film.prev.title}
          </a>
          <a
            href={`/work/${cat.slug}/${film.next.n}`}
            className="text-right transition-colors hover:text-white"
          >
            {film.next.n} {film.next.title} &rarr;
          </a>
        </nav>
      )}

      {/* Contact */}
      <footer className="px-4 pb-16 pt-24 text-center text-[10px] font-bold text-[#e5201f] md:pt-32">
        Contact:{" "}
        <a href="mailto:hello@example.com" className="text-red-500">
          hello@example.com
        </a>
      </footer>
    </main>
  );
}