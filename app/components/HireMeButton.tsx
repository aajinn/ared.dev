"use client";

import { useState } from "react";

export function HireMeButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = email;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="mt-8 flex w-full max-w-xs items-center justify-center gap-3 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 active:scale-95 sm:w-auto lg:justify-start"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
        <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 6l10 7 10-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <span className="flex flex-col items-start leading-tight">
        <span>{copied ? "Copied!" : "Hire Me"}</span>
        <span className="text-xs font-normal opacity-70">{copied ? "Email copied to clipboard" : email}</span>
      </span>
    </button>
  );
}
