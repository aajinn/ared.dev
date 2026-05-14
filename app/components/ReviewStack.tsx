"use client";

import { useState } from "react";
import Image from "next/image";
import { ReviewLightbox } from "./ReviewLightbox";

interface Props {
  images: string[];
  eager?: boolean;
}

const TRANSFORMS = [
  { rotate: -12, x:  18, y:  8  },
  { rotate:  9,  x: -14, y:  14 },
  { rotate: -5,  x:  10, y: -10 },
  { rotate:  14, x: -18, y:  10 },
  { rotate: -10, x:  14, y: -14 },
  { rotate:  6,  x: -10, y:  6  },
  { rotate: -15, x:  6,  y:  16 },
  { rotate:  11, x: -6,  y: -8  },
];

export function ReviewStack({ images, eager = false }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <>
      {/* First image is relative (sets natural height), rest are absolute on top */}
      <div className="relative w-full">
        {images.map((src, i) => {
          const t = TRANSFORMS[i % TRANSFORMS.length];
          const isTop = i === images.length - 1;
          const isHovered = hovered === i;
          const isFirst = i === 0;

          return (
            <button
              key={src}
              onClick={() => setLightboxIndex(i)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              aria-label={`View review ${i + 1}`}
              className={`${isFirst ? "relative" : "absolute inset-0"} w-full cursor-pointer rounded-lg border border-white/10 bg-[#0a0a0f]`}
              style={{
                zIndex: isHovered ? 20 : isTop ? images.length : i,
                transform: isHovered
                  ? "rotate(0deg) translate(0px, -10px) scale(1.03)"
                  : `rotate(${t.rotate}deg) translate(${t.x}px, ${t.y}px)`,
                transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease",
                boxShadow: isHovered
                  ? "0 24px 60px rgba(0,0,0,0.9)"
                  : "0 8px 32px rgba(0,0,0,0.7)",
              }}
            >
              <Image
                src={src}
                alt={`Review ${i + 1}`}
                width={600}
                height={400}
                loading={eager && isTop ? "eager" : "lazy"}
                preload={eager && isTop}
                quality={80}
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 320px, 384px"
                className="h-auto w-full rounded-lg object-contain"
              />
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-center text-[10px] uppercase tracking-[0.2em] text-[#555570]">
        {images.length} review{images.length !== 1 ? "s" : ""} · click to view
      </p>

      {lightboxIndex !== null && (
        <ReviewLightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
