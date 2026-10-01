import { useEffect, useMemo } from "react";
import { categories } from "../Projects/data/categories";
import { getFilms } from "./data/films";
import useIsDesktop from "../Home/hooks/useIsDesktop";
import useSlowConnection from "../Home/hooks/useSlowConnection";
import FilmTile from "./components/FilmTile";

export default function Category({ slug }) {
  const isDesktop = useIsDesktop();
  const dataSaver = useSlowConnection();
  const cat = categories.find((c) => c.slug === slug);
  const films = useMemo(() => (cat ? getFilms(cat) : []), [cat]);

  // normal page scrolling, same opt-in class as the Work page
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("page-scroll");
    return () => html.classList.remove("page-scroll");
  }, []);

  if (!cat) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <a href="/work">Back to work</a>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black pt-28 text-white md:pt-36">
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between px-5 pt-6 font-bold uppercase text-white mix-blend-difference md:px-8 md:pt-8">
        
      </header>

      <section className="mb-10 px-2 md:mb-14">
        <h1 className="text-[clamp(2.5rem,8vw,7rem)] font-light leading-[0.9] tracking-tighter">
          {cat.title}
        </h1>
        <p className="mt-2 text-xs font-bold uppercase text-neutral-500">
          {cat.meta}
        </p>
      </section>

      <div className="grid grid-cols-1 gap-x-2 gap-y-8 px-2 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {films.map((film) => (
          <FilmTile
            key={film.n}
            film={film}
            href={`/work/${cat.slug}/${film.n}`}
            isDesktop={isDesktop}
            dataSaver={dataSaver}
          />
        ))}
      </div>
    </main>
  );
}