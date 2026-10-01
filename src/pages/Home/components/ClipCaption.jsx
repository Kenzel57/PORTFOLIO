export default function ClipCaption({ clip }) {
  return (
    <div
      key={clip.id}
      className="caption-in absolute left-1/2 top-1/2 w-[70vw] max-w-xs -translate-x-1/2 -translate-y-1/2 text-center text-[10px] leading-tight md:left-[75%] md:top-[85%] md:w-auto md:max-w-[22vw] md:translate-x-0 md:translate-y-0 md:text-left md:text-[clamp(0.6rem,0.75vw,0.8rem)]"
    >
      <p className="text-[0.9em] font-bold tracking-widest text-[#e5201f]">
        {clip.duration}
      </p>

      <h3 className="mt-1 text-[2em] font-bold leading-none text-white">
        {clip.title}
      </h3>

      <div className="mx-auto my-2 h-px w-8 bg-[#e5201f] md:mx-0" />

      <p className="text-[1.1em] italic text-neutral-100">{clip.tagline}</p>

      <p className="mt-1 text-[0.95em] leading-snug text-neutral-400">
        {clip.description}
      </p>
    </div>
  );
}