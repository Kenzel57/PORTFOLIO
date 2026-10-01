import { useCallback, useEffect, useRef, useState } from "react";

const LOCK_MS = 1400; // a bit longer than the 1300ms water transition

export default function useClipNavigation(count, enabled = true) {
  const [index, setIndex] = useState(0);
  const locked = useRef(false);

  const go = useCallback(
    (dir) => {
      if (locked.current) return;
      locked.current = true;
      setIndex((i) => (i + dir + count) % count);
      setTimeout(() => {
        locked.current = false;
      }, LOCK_MS);
    },
    [count]
  );

  useEffect(() => {
    if (!enabled) return;

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) < 20) return;
      go(e.deltaY > 0 ? 1 : -1);
    };

    const onKey = (e) => {
      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) go(1);
      if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) go(-1);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [go, enabled]);

  return { index, setIndex, go };
}