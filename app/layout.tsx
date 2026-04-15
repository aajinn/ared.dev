import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
