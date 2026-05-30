"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import type { Components } from "react-markdown";

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
  img: ({ src, alt }) => (
    <img src={src} alt={alt} className="w-full rounded-lg" />
  ),
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
