import useIsDesktop from "../hooks/useIsDesktop";
import WaterCanvas from "./WaterCanvas";
import MobileScroller from "./MobileScroller";

export default function VideoStage({
  clips,
  activeIndex,
  onIndexChange,
  postersOnly,
}) {
  const isDesktop = useIsDesktop();

  // Data saver on desktop: posters with a simple crossfade
  if (isDesktop && postersOnly) {
    return (
      <div className="absolute inset-0 z-0 bg-black">
        {clips.map((c, i) => (
          <img
            key={c.id}
            src={c.poster}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              i === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
    );
  }

  if (isDesktop) {
    return <WaterCanvas clips={clips} activeIndex={activeIndex} />;
  }

  return (
    <MobileScroller
      clips={clips}
      activeIndex={activeIndex}
      onIndexChange={onIndexChange}
      postersOnly={postersOnly}
    />
  );
}