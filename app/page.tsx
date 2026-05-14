import fs from "fs";
import path from "path";
import { cacheLife } from "next/cache";
import { ReviewGrid } from "./components/ReviewGrid";
import { ReviewStack } from "./components/ReviewStack";

const skills = [
  { category: "Languages", items: ["JavaScript", "Python", "HTML", "CSS"] },
  { category: "Frontend", items: ["React.js", "Next.js", "Tailwind CSS"] },
  { category: "Backend", items: ["Node.js", "Express.js"] },
  { category: "Databases", items: ["MongoDB", "PostgreSQL"] },
];

const projects = [
  {
    title: "Real-Time Internet Speed Monitor",
    tag: "Chrome Extension",
    bullets: [
      "Built and published a Chrome extension for real-time internet speed tracking",
      "Achieved 1,000+ active users on Chrome Web Store",
    ],
  },
  {
    title: "Leaf Diseases Detection",
    tag: "ML + Payments",
    bullets: [
      "Integrated Razorpay payment gateway for paid usage access",
      "Developed end-to-end pipeline: image upload → processing → prediction → paid results",
    ],
  },
];

export default async function Home() {
  "use cache";
  cacheLife("max");

  const publicDir = path.join(process.cwd(), "public");
  const reviewImages = fs
    .readdirSync(publicDir)
    .filter((f) => /^r\d+\.(png|jpg|jpeg|webp)$/i.test(f))
    .sort()
    .map((f) => `/${f}`);

  return (
    <main className="relative bg-[#0a0a0f] text-[#e8e8f0]">
      {/* Hero + Reviews side-by-side on desktop */}
      <section className="flex min-h-[100svh] flex-col items-center justify-center px-5 text-center lg:flex-row lg:items-center lg:justify-center lg:gap-16 lg:px-16 lg:text-left xl:px-24">

        {/* Left: hero text */}
        <div className="flex flex-col items-center lg:items-start lg:flex-1">
          <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#555570] sm:text-xs">
            Full Stack Developer
          </p>
          <h1 className="animate-slide-left hero-name text-[clamp(2.4rem,10vw,5.5rem)] uppercase tracking-[0.08em] leading-[0.95] text-[#f0f0ff]">
            <span className="hero-name-line">Ajin</span>
            <span className="hero-name-line">Varghese</span>
            <span className="hero-name-line">Chandy</span>
          </h1>
          <div className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
            {[
              "REST APIs", "Auth & JWT", "Rate Limiting", "Payment Integration",
              "Real-time Systems", "Database Design", "CI/CD", "Chrome Extensions",
              "AI Integration", "Async Programming", "Web Performance", "Automation",
            ].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#2a2a3a] px-3 py-1 text-xs text-[#7070a0]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Email CTA — prominent for HR */}
          <a
            href="https://mail.google.com/mail/?view=cm&to=careerajin@gmail.com&su=Opportunity%20for%20Ajin%20Varghese%20Chandy&body=Hi%20Ajin%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20I%20am%20interested%20in%20discussing%20a%20potential%20opportunity%20with%20you.%0A%0ARole%3A%20%5BJob%20Title%5D%0ACompany%3A%20%5BCompany%20Name%5D%0ALocation%3A%20%5BRemote%20%2F%20On-site%20%2F%20Hybrid%5D%0A%0AHere%20is%20a%20brief%20overview%20of%20what%20we%20are%20looking%20for%3A%0A%5BDescribe%20the%20role%20and%20requirements%5D%0A%0ALooking%20forward%20to%20hearing%20from%20you.%0A%0ABest%20regards%2C%0A%5BYour%20Name%5D%0A%5BYour%20Company%5D%0A%5BYour%20Contact%5D"
            target="_blank"
            rel="noreferrer"
            className="mt-8 flex w-full max-w-xs items-center justify-center gap-3 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 active:scale-95 sm:w-auto lg:justify-start"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M2 6l10 7 10-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Hire Me · careerajin@gmail.com
          </a>

          {/* Social links */}
          <div className="mt-4 flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4 lg:justify-start">
            <a href="https://github.com/aajinn" target="_blank" rel="noreferrer"
              className="rounded border border-[#2a2a3a] py-3 text-center text-xs uppercase tracking-[0.18em] text-[#7070a0] transition hover:border-[#6060a0] hover:text-[#e8e8f0] sm:px-5 sm:py-2">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/ajin-varghese-chandy-1654a4276" target="_blank" rel="noreferrer"
              className="rounded border border-[#2a2a3a] py-3 text-center text-xs uppercase tracking-[0.18em] text-[#7070a0] transition hover:border-[#6060a0] hover:text-[#e8e8f0] sm:px-5 sm:py-2">
              LinkedIn
            </a>
            <a href="https://x.com/areddev" target="_blank" rel="noreferrer"
              className="rounded border border-[#2a2a3a] py-3 text-center text-xs uppercase tracking-[0.18em] text-[#7070a0] transition hover:border-[#6060a0] hover:text-[#e8e8f0] sm:px-5 sm:py-2">
              X (Twitter)
            </a>
          </div>
          <div className="mt-12 flex flex-col items-center gap-1 text-[#2a2a3a] lg:hidden">
            <span className="text-[10px] tracking-widest uppercase">Scroll</span>
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8" cy="7" r="2" fill="currentColor" className="animate-bounce" />
            </svg>
          </div>
        </div>

        {/* Right: reviews — desktop only */}
        {reviewImages.length > 0 && (
          <div className="hidden lg:flex lg:flex-col lg:w-80 xl:w-96 lg:shrink-0">
            <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#555570]">Reviews</p>
            <ReviewStack images={reviewImages} eager />
          </div>
        )}
      </section>

      {/* Reviews — mobile only */}
      {reviewImages.length > 0 && (
        <section className="px-5 py-16 bg-[#0e0e16] lg:hidden sm:px-6 sm:py-24">
          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-8 flex items-center gap-4 sm:mb-10">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#555570] sm:text-xs">02</span>
              <h2 className="text-lg font-semibold tracking-wide text-[#e8e8f0] sm:text-xl">Reviews</h2>
              <div className="h-px flex-1 bg-[#1e1e2e]" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              <ReviewGrid
                images={reviewImages}
                sizes="(max-width: 640px) 100vw, 50vw"
                columns={2}
              />
            </div>
          </div>
        </section>
      )}

      {/* Skills + Projects */}
      <div className="bg-[#0e0e16]">
        <section className="px-5 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-8 flex items-center gap-4 sm:mb-10">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#555570] sm:text-xs">03</span>
              <h2 className="text-lg font-semibold tracking-wide text-[#e8e8f0] sm:text-xl">Skills</h2>
              <div className="h-px flex-1 bg-[#1e1e2e]" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              {skills.map(({ category, items }) => (
                <div key={category} className="rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] p-4 sm:p-5">
                  <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[#555570] sm:text-xs">{category}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <span key={item} className="rounded-full bg-[#1a1a2e] px-3 py-1 text-xs text-[#a0a0c0] sm:text-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-16 sm:px-6 sm:pb-24">
          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-8 flex items-center gap-4 sm:mb-10">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#555570] sm:text-xs">04</span>
              <h2 className="text-lg font-semibold tracking-wide text-[#e8e8f0] sm:text-xl">Projects</h2>
              <div className="h-px flex-1 bg-[#1e1e2e]" />
            </div>
            <div className="flex flex-col gap-4 sm:gap-6">
              {projects.map((project) => (
                <div key={project.title} className="rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] p-4 sm:p-6">
                  <div className="mb-3 flex flex-wrap items-start gap-2 sm:mb-4 sm:items-center sm:gap-3">
                    <h3 className="text-sm font-semibold leading-snug text-[#e8e8f0] sm:text-base">{project.title}</h3>
                    <span className="rounded-full border border-[#2a2a3a] px-3 py-0.5 text-[10px] text-[#555570] sm:text-xs">
                      {project.tag}
                    </span>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {project.bullets.map((b) => (
                      <li key={b} className="flex gap-3 text-xs text-[#7070a0] leading-relaxed sm:text-sm">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3a3a5a]" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="px-5 py-8 text-center bg-[#0e0e16] sm:py-10">
        <p className="text-[10px] text-[#555570] tracking-widest uppercase sm:text-xs">
          Ajin Varghese Chandy · Full Stack Developer
        </p>
      </footer>
    </main>
  );
}
