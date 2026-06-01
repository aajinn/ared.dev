"use client";

import { useState, FormEvent } from "react";

export function ContactForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send");
      }

      setStatus("sent");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="contact-email" className="mb-1 block text-[10px] uppercase tracking-wider text-[#555570]">
          Your Email
        </label>
        <input
          id="contact-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-lg border border-[#2a2a3a] bg-[#1a1a2e] px-4 py-3 text-sm text-[#e8e8f0] outline-none transition focus:border-[#6060a0] placeholder:text-[#555570]"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-1 block text-[10px] uppercase tracking-wider text-[#555570]">
          Message
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your message..."
          className="w-full resize-y rounded-lg border border-[#2a2a3a] bg-[#1a1a2e] px-4 py-3 text-sm text-[#e8e8f0] outline-none transition focus:border-[#6060a0] placeholder:text-[#555570]"
        />
      </div>

      {status === "error" && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="self-start rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : status === "sent" ? "Sent!" : "Send Message"}
      </button>
    </form>
  );
}
