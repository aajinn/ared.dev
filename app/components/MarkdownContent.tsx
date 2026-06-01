"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import type { Components } from "react-markdown";
import Image from "next/image";

function useOptimizedImage(src: string): { optimized: boolean; host: string } {
  try {
    const url = new URL(src);
    return {
      optimized: url.hostname.endsWith(".supabase.co"),
      host: url.hostname,
    };
  } catch {
    return { optimized: false, host: "" };
  }
}

const overrides: Components = {
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[var(--color-accent,#6060a0)] underline"
    >
      {children}
    </a>
  ),
  img: ({ src, alt }) => {
    if (typeof src !== "string") return null;
    const { optimized } = useOptimizedImage(src);

    if (optimized) {
      return (
        <span
          className="relative block w-full overflow-hidden rounded-lg"
          style={{ aspectRatio: "16/9" }}
        >
          <Image
            src={src}
            alt={alt || ""}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
          />
        </span>
      );
    }

    return (
      <span
        className="relative block w-full overflow-hidden rounded-lg"
        style={{ aspectRatio: "16/9" }}
      >
        <img
          src={src}
          alt={alt || ""}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </span>
    );
  },
};

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose prose-invert max-w-none text-[var(--color-text-secondary,#7070a0)] [&_h2]:text-[var(--color-text,#e8e8f0)] [&_h3]:text-[var(--color-text,#e8e8f0)] [&_strong]:text-[var(--color-text,#e8e8f0)]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={overrides}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
