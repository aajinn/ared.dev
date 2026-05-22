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

  return (
    <html lang="en" className={`${inter.variable} antialiased`} style={{ colorScheme: t.mode }}>
      <body
        className="font-sans overflow-x-hidden"
        style={{
          backgroundColor: t.background,
          color: t.textPrimary,
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
        } as React.CSSProperties}
      >
        {children}
      </body>
    </html>
  );
}

