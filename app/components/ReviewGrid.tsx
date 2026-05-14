"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { ReviewLightbox } from "./ReviewLightbox";

interface Props {
  images: string[];
  sizes: string;
  eager?: boolean;
  columns?: number; // how many columns in the grid (default 1)
}

export function ReviewGrid({ images, sizes, eager = false, columns = 1 }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = useCallback((i: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setHoverIndex(i), 80);
  }, []);

  const handleLeave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setHoverIndex(null);
  }, []);

  // Items in the first row should show preview below, rest above
  const isTopRow = (i: number) => i < columns;

  return (
    <>
      {images.map((src, i) => {
        const showBelow = isTopRow(i);
        return (
          <button
            key={src}
            onClick={() => setLightboxIndex(i)}
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={handleLeave}
            className="group relative rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] cursor-zoom-in text-left transition-colors duration-200 hover:border-[#3a3a5a]"
            aria-label={`View review ${i + 1}`}
          >
            <Image
              src={src}
              alt={`Review ${i + 1}`}
              width={600}
              height={400}
              loading={i === 0 ? "eager" : "lazy"}
              preload={i === 0}
              quality={80}
              sizes={sizes}
              className="h-auto w-full rounded-lg object-contain"
            />

            {/* Hover preview — desktop only, hidden on mobile to prevent overflow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 z-50 hidden w-[700px] overflow-hidden rounded-xl border border-[#3a3a5a] bg-[#0a0a0f] shadow-[0_24px_80px_rgba(0,0,0,0.9)] md:block"
              style={{
                ...(showBelow
                  ? { top: "calc(100% + 12px)" }
                  : { bottom: "calc(100% + 12px)" }),
                transform: hoverIndex === i
                  ? "translateX(-50%) scale(1)"
                  : `translateX(-50%) scale(0.94)`,
                opacity: hoverIndex === i ? 1 : 0,
                transition: "opacity 0.18s ease, transform 0.18s ease",
                willChange: "opacity, transform",
              }}
            >
              <Image
                src={src}
                alt=""
                width={1400}
                height={933}
                quality={90}
                sizes="700px"
                className="h-auto w-full object-contain"
              />
            </div>
          </button>
        );
      })}

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
