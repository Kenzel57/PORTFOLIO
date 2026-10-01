import { useEffect, useState } from "react";

export default function ChangingImage({
  images,
  interval = 2500,
  className = "",
}) {
  const [i, setI] = useState(0);

  // preload all photos so the swap is instant
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setI((n) => (n + 1) % images.length), interval);
    return () => clearInterval(id);
  }, [images, interval]);

  return <img src={images[i]} alt="" className={className} />;
}