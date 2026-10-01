import { useEffect } from "react";

const PULL_NEEDED = 90; // finger: how far (px) you drag down
const WHEEL_NEEDED = 80; // mouse wheel in a narrow window: how much upward scroll
const DESKTOP = "(min-width: 768px)"; // same breakpoint as the rest of the site

const atTop = () =>
  (document.scrollingElement?.scrollTop ?? window.scrollY) <= 0;

// MOBILE VIEW ONLY (screen narrower than 768px): scrolling up while already at
// the top of the page goes to `href`. Works with a real finger and also with a
// mouse wheel in a narrow browser window / dev tools. The gesture only counts
// if it STARTED at the top, so momentum from the bottom never throws you out.
export default function useScrollUpToHome(href = "/") {
  useEffect(() => {
    const html = document.documentElement;
    const isDesktop = () => window.matchMedia(DESKTOP).matches;

    // stops Android Chrome's pull-to-refresh from stealing the gesture
    html.style.overscrollBehaviorY = "contain";

    let leaving = false;
    const leave = () => {
      if (leaving) return;
      leaving = true;
      window.location.assign(href);
    };

    // Finger
    let startY = 0;
    let pulling = false;
    const onTouchStart = (e) => {
      if (isDesktop()) {
        pulling = false;
        return;
      }
      startY = e.touches[0].clientY;
      pulling = atTop();
    };
    const onTouchMove = (e) => {
      if (!pulling) return;
      if (!atTop()) {
        pulling = false;
        return;
      }
      if (e.touches[0].clientY - startY > PULL_NEEDED) leave();
    };

    // Mouse wheel / trackpad (narrow window)
    let lastWheel = 0;
    let startedAtTop = false;
    let total = 0;
    const onWheel = (e) => {
      if (isDesktop()) return;

      const now = performance.now();
      if (now - lastWheel > 200) {
        // a new gesture begins after a short pause
        startedAtTop = atTop();
        total = 0;
      }
      lastWheel = now;

      if (!atTop()) {
        startedAtTop = false;
        return;
      }
      if (!startedAtTop) return;

      if (e.deltaY < 0) {
        total += e.deltaY;
        if (total < -WHEEL_NEEDED) leave();
      } else {
        total = 0;
      }
    };

    // Back button restoring this page from memory: allow leaving again
    const onShow = (e) => {
      if (e.persisted) leaving = false;
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("pageshow", onShow);

    return () => {
      html.style.overscrollBehaviorY = "";
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("pageshow", onShow);
    };
  }, [href]);
}