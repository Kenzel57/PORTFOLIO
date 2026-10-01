import { clips } from "./data/clips";
import useClipNavigation from "./hooks/useClipNavigation";
import usePreloadNext from "./hooks/usePreloadNext";
import useSlowConnection from "./hooks/useSlowConnection";
import useIsDesktop from "./hooks/useIsDesktop";
import VideoStage from "./components/VideoStage";
import NameMark from "./components/NameMark";
import NavLinks from "./components/NavLinks";
import ClipCaption from "./components/ClipCaption";
import ContactInfo from "./components/ContactInfo";

export default function Home() {
  const isDesktop = useIsDesktop();
  const { index, setIndex } = useClipNavigation(clips.length, isDesktop);
  const slowConnection = useSlowConnection();
  usePreloadNext(clips, index);

  return (
    <main className="fixed inset-0 select-none overflow-hidden bg-black md:touch-none">
      <VideoStage
        clips={clips}
        activeIndex={index}
        onIndexChange={setIndex}
        postersOnly={slowConnection}
      />

      {/* Dark contrast layer: tames bright footage. Darker at the top and
          bottom, where the name and contact text sit. Touches pass through. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* pointer-events-none lets touches pass through to the scroller below */}
      <div className="pointer-events-none absolute inset-0 z-20 font-bold uppercase text-white mix-blend-difference">
        <NameMark />
        <NavLinks />
        <ClipCaption clip={clips[index]} />
        <ContactInfo />
      </div>
    </main>
  );
}