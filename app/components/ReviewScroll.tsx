"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ReviewLightbox } from "./ReviewLightbox";

interface Props {
  images: string[];
}

const INTERVAL = 3500;
const PER_PAGE = 1;

export function ReviewScroll({ images }: Props) {
  const total = Math.ceil(images.length / PER_PAGE);
  const [page, setPage] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || total <= 1) return;
    const id = setInterval(() => setPage((p) => (p + 1) % total), INTERVAL);
    return () => clearInterval(id);
  }, [paused, total]);

  const visibleImages = images.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <>
      <div
        className="flex w-full flex-col"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#555570]">
          Reviews
        </p>

        {/* Single card, full width */}
        <div className="w-full">
          {visibleImages.map((src, slot) => {
            const globalIndex = page * PER_PAGE + slot;
            return (
              <button
                key={`${page}-${slot}`}
                onClick={() => setLightboxIndex(globalIndex)}
                aria-label={`View review ${globalIndex + 1}`}
                className="w-full overflow-hidden rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] cursor-zoom-in shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-all duration-200 hover:border-[#3a3a5a] hover:shadow-[0_8px_32px_rgba(0,0,0,0.8)]"
                style={{ animation: `reviewFadeIn 0.45s cubic-bezier(0.22,1,0.36,1) both` }}
              >
                <Image
                  src={src}
                  alt={`Review ${globalIndex + 1}`}
                  width={600}
                  height={400}
                  loading={page === 0 && slot === 0 ? "eager" : "lazy"}
                  preload={page === 0 && slot === 0}
                  quality={80}
                  sizes="(max-width: 1280px) 320px, 384px"
                  className="h-auto w-full object-contain"
                />
              </button>
            );
          })}
        </div>

        {/* Dots + counter */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-2">
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                onClick={() => { setPage(i); setPaused(true); setTimeout(() => setPaused(false), 6000); }}
                aria-label={`Go to page ${i + 1}`}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: page === i ? "20px" : "6px",
                  background: page === i ? "#e8e8f0" : "#2a2a3a",
                }}
              />
            ))}
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#555570]">
            {page + 1} / {images.length}
          </span>
        </div>
      </div>

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
