import { useEffect, useRef, useState } from "react";
import useInView from "../hooks/useInView";

export default function CategoryTile({
  cat,
  style,
  dimmed = false,
  onHover,
  showCaption = false,
  dataSaver = false,
}) {
  const [wrapRef, inView] = useInView();
  const videoRef = useRef(null);
  const userPaused = useRef(false);
  const [userStarted, setUserStarted] = useState(false);
  const [seen, setSeen] = useState(false);
  const [playing, setPlaying] = useState(false);

  // autoplay tiles load their video; others wait for the user to press play
  const enabled = (cat.autoplay && !dataSaver) || userStarted;

  useEffect(() => {
    if (inView) setSeen(true);
  }, [inView]);

  // play only while on screen, unless the user paused it
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView && !userPaused.current) v.play().catch(() => {});
    else if (!inView) v.pause();
  }, [inView, enabled, seen]);

  const toggle = () => {
    if (!enabled) {
      userPaused.current = false;
      setUserStarted(true);
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  return (
    <div
      ref={wrapRef}
      style={style}
      onMouseEnter={() => onHover?.(cat)}
      onMouseLeave={() => onHover?.(null)}
      className={`transition-opacity duration-500 ${
        dimmed ? "opacity-30" : "opacity-100"
      }`}
    >
      <div
        className="relative overflow-hidden bg-neutral-300"
        style={{ aspectRatio: cat.aspect }}
      >
        {/* poster under the video, so there is never a black flash */}
        <img
          src={cat.poster}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {enabled && seen && (
          <video
            ref={videoRef}
            src={cat.video}
            muted
            loop
            playsInline
            preload="auto"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* click anywhere on the video to open the category */}
        <a
          href={`/work/${cat.slug}`}
          aria-label={`${cat.title} videos`}
          className="absolute inset-0 z-10"
        />

        {/* play / pause sits above the link, so it doesn't navigate */}
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? `Pause ${cat.title}` : `Play ${cat.title}`}
          className="absolute bottom-2 right-2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm"
        >
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <rect x="1" y="0" width="3.5" height="12" />
              <rect x="7.5" y="0" width="3.5" height="12" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M2 0l9 6-9 6z" />
            </svg>
          )}
        </button>
      </div>

      {showCaption && (
        <div className="mt-2 text-base font-medium leading-tight">
          {cat.title}
          <div className="font-serif text-sm font-normal italic">
            {cat.meta}
          </div>
        </div>
      )}
    </div>
  );
}