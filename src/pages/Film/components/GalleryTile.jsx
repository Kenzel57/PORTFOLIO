import { useEffect, useRef, useState } from "react";
import useInView from "../../Projects/hooks/useInView";

// One tile in the gallery: a still image, or a short muted looping shot.
// Nothing loads until the tile is near the screen, and shots only play
// while visible (never on data saver).
export default function GalleryTile({ item, dataSaver }) {
  const [wrapRef, inView] = useInView("200px");
  const videoRef = useRef(null);
  const [seen, setSeen] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (inView) setSeen(true);
  }, [inView]);

  const shouldPlay = item.type === "video" && !dataSaver && inView;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (shouldPlay) v.play().catch(() => {});
    else v.pause();
  }, [shouldPlay, seen]);

  return (
    <div
      ref={wrapRef}
      className="relative aspect-video overflow-hidden bg-neutral-900"
    >
      {seen && item.type === "image" && !failed && (
        <img
          src={item.src}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {seen && item.type === "video" && (
        <video
          ref={videoRef}
          src={item.src}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}