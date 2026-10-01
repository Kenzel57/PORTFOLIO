import { useEffect, useRef } from "react";

const END_HREF = "/work"; // where the extra swipe past the last clip leads

function Slide({ clip, isActive, isNear, postersOnly }) {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (isActive) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isActive, isNear]);

  return (
    <section className="relative h-full w-full shrink-0 snap-start snap-always overflow-hidden bg-black">
      {/* poster sits under the video so there is never a black flash */}
      <img
        src={clip.poster}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      {isNear && !postersOnly && (
        <video
          ref={ref}
          src={clip.mobile}
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </section>
  );
}

// The extra screen after the last clip. Landing on it opens the Work page.
function EndSlide() {
  return (
    <section className="relative flex h-full w-full shrink-0 snap-start snap-always items-center justify-center bg-black">
      <span className="text-xs font-bold uppercase tracking-widest text-white/70">
        Work &rarr;
      </span>
    </section>
  );
}

export default function MobileScroller({
  clips,
  activeIndex,
  onIndexChange,
  postersOnly,
}) {
  const ref = useRef(null);
  const raf = useRef(0);
  const settle = useRef(0);
  const touching = useRef(false);
  const leaving = useRef(false);

  const goToProjects = () => {
    if (leaving.current) return;
    leaving.current = true;
    window.location.assign(END_HREF);
  };

  // Called once scrolling has stopped: if we are on the extra screen, leave
  const checkEnd = () => {
    const el = ref.current;
    if (!el || touching.current) return;
    if (Math.round(el.scrollTop / el.clientHeight) >= clips.length) {
      goToProjects();
    }
  };

  useEffect(() => {
    const el = ref.current;
    el.scrollTop = activeIndex * el.clientHeight;

    // Coming back with the browser's back button: stand on the last clip again
    const onShow = (e) => {
      if (!e.persisted) return;
      leaving.current = false;
      el.scrollTop = (clips.length - 1) * el.clientHeight;
    };
    window.addEventListener("pageshow", onShow);

    return () => {
      cancelAnimationFrame(raf.current);
      clearTimeout(settle.current);
      window.removeEventListener("pageshow", onShow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onScroll = () => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      const i = Math.min(
        clips.length - 1,
        Math.max(0, Math.round(el.scrollTop / el.clientHeight))
      );
      if (i !== activeIndex) onIndexChange(i);
    });

    // wait until the scroll has settled before deciding to leave
    clearTimeout(settle.current);
    settle.current = setTimeout(checkEnd, 150);
  };

  return (
    <div
      ref={ref}
      onScroll={onScroll}
      onTouchStart={() => {
        touching.current = true;
      }}
      onTouchEnd={() => {
        touching.current = false;
        clearTimeout(settle.current);
        settle.current = setTimeout(checkEnd, 150);
      }}
      onTouchCancel={() => {
        touching.current = false;
      }}
      className="absolute inset-0 z-0 snap-y snap-mandatory overflow-y-scroll overscroll-y-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {clips.map((clip, i) => (
        <Slide
          key={clip.id}
          clip={clip}
          isActive={i === activeIndex}
          isNear={Math.abs(i - activeIndex) <= 1}
          postersOnly={postersOnly}
        />
      ))}
      <EndSlide />
    </div>
  );
}