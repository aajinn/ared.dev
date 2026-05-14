import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
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
  title: "Ajin Varghese Chandy | Full Stack Developer",
  description:
    "Ajin Varghese Chandy is a Full Stack Developer building modern web experiences.",
  keywords: [
    "Ajin Varghese Chandy",
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
    title: "Ajin Varghese Chandy | Full Stack Developer",
    description:
      "Ajin Varghese Chandy is a Full Stack Developer building modern web experiences.",
    type: "website",
    locale: "en_US",
    siteName: "Ajin Varghese Chandy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ajin Varghese Chandy | Full Stack Developer",
    description:
      "Ajin Varghese Chandy is a Full Stack Developer building modern web experiences.",
    creator: "@areddev",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="font-sans bg-black">{children}</body>
    </html>
  );
}
