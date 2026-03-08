import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js App",
  description: "Built with Next.js 14 and TypeScript",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
