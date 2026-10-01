import { useEffect, useRef, useState } from "react";
import useInView from "../../Projects/hooks/useInView";

export default function FilmTile({ film, href, isDesktop, dataSaver }) {
  const [wrapRef, inView] = useInView("200px");
  const videoRef = useRef(null);
  const [hover, setHover] = useState(false);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (inView) setSeen(true);
  }, [inView]);

  const shouldPlay = !dataSaver && inView && (isDesktop ? hover : true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (shouldPlay) v.play().catch(() => {});
    else v.pause();
  }, [shouldPlay, seen]);

  return (
    <div
      ref={wrapRef}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <a href={href} className="group block">
        <div className="relative aspect-video overflow-hidden bg-neutral-900">
          {seen && (
            <video
              ref={videoRef}
              src={`${film.video}#t=0.5`}
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>

        <div className="mt-2 flex text-[11px] font-bold uppercase leading-tight text-neutral-500 transition-colors group-hover:text-white md:text-xs">
          <span className="w-9 shrink-0">{film.n}</span>
          <span>
            {film.title}
            <br />
            {film.type}
          </span>
        </div>
      </a>
    </div>
  );
}