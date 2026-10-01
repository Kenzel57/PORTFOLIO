export default function ClipCaption({ clip }) {
  return (
    <div
      key={clip.id}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[10px] leading-tight md:left-[75%] md:top-[85%] md:translate-x-0 md:translate-y-0 md:text-left md:text-[clamp(0.6rem,0.75vw,0.8rem)]"
    >
      <div>{clip.title}</div>
      <div>{clip.duration}</div>
    </div>
  );
}