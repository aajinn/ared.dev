import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
     subsets: ["latin"],
     variable: "--font-inter",
     display: 'swap',
});

export const metadata: Metadata = {
     title: "Ajin Varghese Chandy",
     description: "Ajin Varghese Chandy's Portfolio Website."
};

export const viewport = "width=device-width, initial-scale=1";

const jsonLd = {
     "@context": "https://schema.org",
     "@graph": [
          {
               "@type": "WebSite",
               name: "ared.dev",
               url: "https://ared.dev",
               author: {
                    "@type": "Person",
                    name: "Ajin Varghese Chandy",
                    url: "https://ared.dev",
               },
          },
          {
               "@type": "WebPage",
               name: "Ajin Varghese Chandy | Web Developer",
               description:
                    "Ajin is a web developer proficient in Next.js, Svelte, Node.js, and Express. He has developed multiple websites and Chrome extensions.",
               url: "https://ared.dev",
               isPartOf: {
                    "@type": "WebSite",
                    url: "https://ared.dev",
               },
          },
          {
               "@type": "Person",
               name: "Ajin Varghese Chandy",
               url: "https://ared.dev",
               sameAs: [
                    "https://github.com/aajinn",
                    "https://x.com/ChandyAjin",
               ],
               jobTitle: "Web Developer",
               worksFor: {
                    "@type": "Organization",
                    name: "ared.dev",
                    url: "https://ared.dev",
               },
               image: {
                    "@type": "ImageObject",
                    url: "https://ared.dev/favicon.ico",
               },
          },
     ],
};
export default function RootLayout({
     children,
}: Readonly<{
     children: React.ReactNode;
}>) {
     return (
          <html lang="en">
               <head>
                    <meta name="title" content="Ajin Varghese Chandy" />
                    <meta
                         name="description"
                         content="Hi, I'm Ajin Varghese Chandy. I'm a passionate developer with expertise in web technologies and a keen interest in AI and machine learning."
                    />
                    <meta
                         name="keywords"
                         content="programming , web developer,what does a web developer do,web developer,web developer jobs,web developer salary,web developer internship,web developer certification,web developer jobs near me,web developer job description,web developer jobs remote,web developer portfolio,web developer salary entry level,web developer average salary,web developer apprenticeship"
                    />

                    <meta name="author" content="Ajin Varghese Chandy" />

                    <link
                         rel="apple-touch-icon"
                         sizes="76x76"
                         href="/apple-touch-icon.png"
                    />
                    <link
                         rel="icon"
                         type="image/png"
                         sizes="32x32"
                         href="/favicon-32x32.png"
                    />
                    <link
                         rel="icon"
                         type="image/png"
                         sizes="16x16"
                         href="/favicon-16x16.png"
                    />

                    <link
                         rel="mask-icon"
                         href="/safari-pinned-tab.svg"
                         color="#5bbad5"
                    />
                    <meta name="msapplication-TileColor" content="#da532c" />
                    <meta name="theme-color" content="#fef3c7" />
                    <script
                         type="application/ld+json"
                         dangerouslySetInnerHTML={{
                              __html: JSON.stringify(jsonLd),
                         }}
                    />
               </head>

               <body className={`${inter.className} flex flex-col min-h-screen`}>
                    <Header />
                    <main className="flex-1">
                         {children}
                    </main>
                    <Footer />
               </body>
          </html>
     );
}
