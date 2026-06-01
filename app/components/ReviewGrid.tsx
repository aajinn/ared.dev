"use client";

import { useMemo } from "react";

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
  columns?: number;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-amber-400 text-xs tracking-wider" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}{"☆".repeat(5 - rating)}
    </span>
  );
}

function groupIntoThreads(items: Review[]): Review[][] {
  const threads: Review[][] = [];
  let i = 0;
  while (i < items.length) {
    const current = items[i];
    const next = items[i + 1];
    if (next?.isDeveloper) {
      threads.push([current, next]);
      i += 2;
    } else {
      threads.push([current]);
      i += 1;
    }
  }
  return threads;
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <>
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
    </>
  );
}

export function ReviewGrid({ reviews, columns = 1 }: Props) {
  const threads = useMemo(() => groupIntoThreads(reviews), [reviews]);

  return (
    <>
      {threads.map((thread, i) => (
        <div
          key={`${thread[0].author}-${i}`}
          className="rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] p-4 transition-colors duration-200 hover:border-[#3a3a5a]"
        >
          <ReviewCard review={thread[0]} />
          {thread[1] && (
            <div className="relative ml-3 mt-3 border-l-2 border-emerald-400/30 pl-3">
              <ReviewCard review={thread[1]} />
            </div>
          )}
        </div>
      ))}
    </>
  );
}
