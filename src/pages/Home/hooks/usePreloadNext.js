import { useEffect } from "react";

// Warms the cache with the posters of the next two clips
export default function usePreloadNext(clips, index) {
  useEffect(() => {
    [1, 2].forEach((offset) => {
      const clip = clips[(index + offset) % clips.length];
      const img = new Image();
      img.src = clip.poster;
    });
  }, [clips, index]);
}