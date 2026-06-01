import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { getAllContent } from "@/lib/data";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "Ajin Varghese Chandy | Full Stack Product Builder",
  description:
    "Ajin Varghese Chandy is a Full Stack Product Builder focused on automation, real-time systems, and AI integrations.",
  keywords: [
    "Ajin Varghese Chandy",
    "Full Stack Product Builder",
    "Full Stack Developer",
    "Web Developer",
    "React",
    "Next.js",
    "JavaScript",
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "Ajin Varghese Chandy | Full Stack Product Builder",
    description:
      "Ajin Varghese Chandy is a Full Stack Product Builder focused on automation, real-time systems, and AI integrations.",
    type: "website",
    locale: "en_US",
    siteName: "Ajin Varghese Chandy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ajin Varghese Chandy | Full Stack Product Builder",
    description:
      "Ajin Varghese Chandy is a Full Stack Product Builder focused on automation, real-time systems, and AI integrations.",
    creator: "@areddev",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getAllContent();
  const t = content.theme;
  const storageOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin
    : null;

  return (
    <html lang="en" className={`${inter.variable} antialiased`} style={{ colorScheme: t.mode }}>
      <body
        className="overflow-x-hidden"
        style={{
          backgroundColor: t.background,
          color: t.textPrimary,
          fontFamily: t.fontFamily || "var(--font-inter), system-ui, sans-serif",
          "--color-bg": t.background,
          "--color-surface": t.surface,
          "--color-surface-alt": t.surfaceAlt,
          "--color-border": t.border,
          "--color-text": t.textPrimary,
          "--color-text-secondary": t.textSecondary,
          "--color-text-muted": t.textMuted,
          "--color-accent": t.accent,
          "--color-accent-hover": t.accentHover,
          "--color-primary": t.primary,
          "--radius": t.borderRadius || "12px",
          "--shadow": t.shadow || "0 4px 24px rgba(0,0,0,0.3)",
          "--transition": t.transition || "0.2s",
        } as React.CSSProperties}
      >
        {storageOrigin && <link rel="preconnect" href={storageOrigin} />}
        {storageOrigin && <link rel="dns-prefetch" href={storageOrigin} />}
        {children}
      </body>
    </html>
  );
}

