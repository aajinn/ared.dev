"use client";

import { useEffect, useState } from "react";

interface Review {
  author: string;
  rating: number;
  date: string;
  text: string;
  helpful?: number;
  isDeveloper?: boolean;
}

interface Props {
  reviews: Review[];
}

const INTERVAL = 4000;
const PER_PAGE = 2;

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-amber-400 text-xs tracking-wider" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}{"☆".repeat(5 - rating)}
    </span>
  );
}

export function ReviewScroll({ reviews }: Props) {
  const total = Math.ceil(reviews.length / PER_PAGE);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || total <= 1) return;
    const id = setInterval(() => setPage((p) => (p + 1) % total), INTERVAL);
    return () => clearInterval(id);
  }, [paused, total]);

  const visible = reviews.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <div
      className="flex w-full flex-col"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#555570]">
        Reviews
      </p>

      <div className="flex flex-col gap-3">
        {visible.map((review, i) => (
          <div
            key={`${page}-${i}`}
            className="rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-all duration-200"
            style={{ animation: `reviewFadeIn 0.45s cubic-bezier(0.22,1,0.36,1) both` }}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className={`text-xs font-semibold ${review.isDeveloper ? "text-emerald-400" : "text-[#c0c0e0]"}`}>
                {review.author}
              </span>
              <span className="shrink-0 text-[10px] text-[#555570]">{review.date}</span>
            </div>
            <div className="mb-2">
              <Stars rating={review.rating} />
            </div>
            <p className="text-xs text-[#a0a0c0] leading-relaxed whitespace-pre-line">
              {review.text}
            </p>
            {review.helpful && (
              <p className="mt-2 text-[10px] text-[#555570]">
                {review.helpful} out of {review.helpful} found this helpful
              </p>
            )}
          </div>
        ))}
      </div>

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
          {page + 1} / {total}
        </span>
      </div>
    </div>
  );
}
