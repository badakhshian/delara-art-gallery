"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function HeroSlideshow({ images, alt, intervalSeconds = 5 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, intervalSeconds * 1000);
    return () => clearInterval(id);
  }, [images, intervalSeconds]);

  if (!images || images.length === 0) return null;

  return (
    <>
      {images.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0"
          style={{
            opacity: i === index ? 1 : 0,
            transition: "opacity 1.2s ease",
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority={i === 0}
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      ))}
    </>
  );
}
