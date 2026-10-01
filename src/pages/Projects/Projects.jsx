import { useEffect, useState } from "react";
import { categories } from "./data/categories";
import useIsDesktop from "../Home/hooks/useIsDesktop";
import useSlowConnection from "../Home/hooks/useSlowConnection";
import useScrollUpToHome from "./hooks/useScrollUpToHome";
import WorkHeader from "./components/WorkHeader";
import CategoryTile from "./components/CategoryTile";

export default function Work() {
  const isDesktop = useIsDesktop();
  const dataSaver = useSlowConnection();
  const [hovered, setHovered] = useState(null);

  // scroll up at the very top -> back to Home
  useScrollUpToHome("/");

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("page-scroll");
    return () => html.classList.remove("page-scroll");
  }, []);

  return (
    <main className="min-h-screen bg-[#ededed] pt-24 text-black md:pt-32">
      <WorkHeader />
      <section className="mx-auto mb-16 max-w-[1800px] px-4 md:mb-28">
        <h2 className="text-[clamp(2.75rem,9vw,8rem)] font-light leading-[0.9] tracking-tighter">
          Projects
          <br />
          Realised
        </h2>
        <p className="mt-3 max-w-md font-script text-xl leading-tight text-neutral-500 md:mt-4 md:max-w-xl md:text-3xl">
          Films made close and unhurried, for moments worth keeping.
        </p>
      </section>

      {/* Giant category name on hover (desktop only) */}
      {isDesktop && (
        <div
          aria-hidden="true"
          className={`pointer-events-none fixed inset-0 z-30 flex items-center justify-center px-6 text-center text-[clamp(3rem,9vw,9rem)] font-light leading-none tracking-tighter text-neutral-500 transition-opacity duration-300 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          {hovered?.title}
        </div>
      )}

      {isDesktop ? (
        <div className="mx-auto grid max-w-[1800px] grid-cols-12 gap-x-4 gap-y-24 px-4 pb-40">
          {categories.map((cat) => (
            <CategoryTile
              key={cat.id}
              cat={cat}
              dataSaver={dataSaver}
              onHover={setHovered}
              dimmed={hovered !== null && hovered.id !== cat.id}
              style={{
                gridRow: cat.d.row,
                gridColumn: `${cat.d.col} / span ${cat.d.span}`,
                marginTop: cat.d.mt,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="px-4 pb-24">
          {categories.map((cat) => (
            <CategoryTile
              key={cat.id}
              cat={cat}
              dataSaver={dataSaver}
              showCaption
              style={{
                width: `${cat.m.w}%`,
                marginLeft: `${cat.m.x}%`,
                marginTop: cat.m.mt,
              }}
            />
          ))}
        </div>
      )}
    </main>
  );
}