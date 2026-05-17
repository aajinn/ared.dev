import fs from "fs";
import path from "path";
import { cacheLife } from "next/cache";
import { ReviewGrid } from "./components/ReviewGrid";
import { ReviewScroll } from "./components/ReviewScroll";

const skills = [
  { category: "Languages", items: ["JavaScript", "TypeScript", "C#"] },
  { category: "Backend", items: ["ASP.NET Core", "ASP.NET MVC", "REST APIs", "EF Core"] },
  { category: "Frontend", items: ["React.js", "Next.js", "Tailwind CSS"] },
  { category: "Database", items: ["SQL Server", "MongoDB"] },
  { category: "Tools & Concepts", items: ["Git", "GitHub", "OOP", "MVC Architecture"] },
];

const experience = {
  role: "Independent Software Developer",
  period: "2024 – Present",
  description: "Projects shipped independently, demonstrating full ownership and public deployment.",
  items: [
    { label: "Real-Time Internet Speed Monitor", url: "https://chromewebstore.google.com/detail/real-time-internet-speed/baffnjfijbgpjchgdmbnpkloeccnhenl", github: "https://github.com/aajinn/real-time-internet-speed", detail: "Chrome Extension — Engineered and published a performant tool now at 1,000+ active installs. Used Manifest V3 Service Workers to achieve <5% CPU usage and a sub‑1MB package, resulting in a 4.1★ store rating." },
    { label: "MongooseNet NuGet Package", url: "https://www.nuget.org/packages/MongooseNet/", github: "https://github.com/aajinn/MongooseNet", detail: "Authored and published a reusable C# library for schema‑flexible data handling in MongoDB. Delivered full XML docs and semantic versioning for drop‑in integration across modern .NET projects." },
  ],
};

const project = {
  title: "TaskFlow – Full-Stack Project Management App",
  period: "2026",
  items: [
    { label: "Scalable Architecture", detail: "Next.js (React) frontend and ASP.NET Core Web API backend, using modular service-based backend architecture." },
    { label: "Real-Time Collaboration", detail: "SignalR and ASP.NET Core WebSockets eliminating manual page refreshes for collaborative teams." },
    { label: "Auth & Access Control", detail: "JWT authentication and role‑based access (Admin/Member) to secure multi‑user workspaces." },
    { label: "Polished UI/UX", detail: "Mobile‑first, responsive design with Tailwind CSS, skeleton loaders, and optimistic UI updates." },
  ],
};

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
    <main className="relative bg-[#0a0a0f] text-[#e8e8f0] overflow-x-hidden">
      {/* Hero + Reviews side-by-side on desktop */}
      <section className="flex min-h-[100svh] flex-col items-center justify-center px-5 text-center lg:flex-row lg:items-center lg:justify-center lg:gap-16 lg:px-16 lg:text-left xl:px-24">

        {/* Left: hero text */}
        <div className="flex flex-col items-center text-center lg:items-start lg:flex-1 lg:text-left">
          <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#555570] sm:text-xs">
            Full Stack Product Builder
          </p>
          <h1 className="animate-slide-left hero-name text-[clamp(2.4rem,10vw,5.5rem)] uppercase tracking-[0.08em] leading-[0.95] text-[#f0f0ff]">
            <span className="hero-name-line">Ajin</span>
            <span className="hero-name-line">Varghese</span>
            <span className="hero-name-line">Chandy</span>
          </h1>
          <p className="mt-5 max-w-sm px-2 text-sm text-[#7070a0] leading-relaxed lg:px-0">
            Building scalable web products focused on automation, real-time systems, and AI integrations.
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2 lg:justify-start">
            {[
              "REST APIs", "Auth & JWT", "Rate Limiting", "Payment Integration",
              "Real-time Systems", "Database Design", "CI/CD", "Chrome Extensions",
              "AI Integration", "Async Programming", "Web Performance", "Automation",
            ].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#2a2a3a] px-3 py-1 text-xs text-[#7070a0] whitespace-nowrap"
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
              <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M2 6l10 7 10-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="flex flex-col items-start leading-tight">
              <span>Hire Me</span>
              <span className="text-xs font-normal opacity-70">careerajin@gmail.com</span>
            </span>
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

        {/* Right: reviews — desktop scroll reveal */}
        {reviewImages.length > 0 && (
          <div className="hidden lg:block lg:w-80 xl:w-96 lg:shrink-0">
            <ReviewScroll images={reviewImages} />
          </div>
        )}
      </section>

      {/* Reviews — mobile only */}
      {reviewImages.length > 0 && (
        <section className="px-5 py-16 bg-[#0e0e16] lg:hidden sm:px-6 sm:py-24 overflow-hidden">
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
                <div key={category} className="min-w-0 rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] p-4 sm:p-5">
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
              <h2 className="text-lg font-semibold tracking-wide text-[#e8e8f0] sm:text-xl">Technical Experience</h2>
              <div className="h-px flex-1 bg-[#1e1e2e]" />
            </div>
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="min-w-0 rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] p-4 sm:p-6">
                <div className="mb-3 flex flex-wrap items-start gap-2 sm:mb-4 sm:items-center sm:gap-3">
                  <h3 className="text-sm font-semibold leading-snug text-[#e8e8f0] sm:text-base">{experience.role}</h3>
                  <span className="rounded-full border border-[#2a2a3a] px-3 py-0.5 text-[10px] text-[#555570] sm:text-xs">
                    {experience.period}
                  </span>
                </div>
                <p className="mb-3 text-xs text-[#7070a0] leading-relaxed sm:text-sm">{experience.description}</p>
                <ul className="flex flex-col gap-2">
                  {experience.items.map((item) => (
                    <li key={item.label} className="flex gap-3 text-xs text-[#7070a0] leading-relaxed sm:text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3a3a5a]" />
                      <span>{item.url ? (<a href={item.url} target="_blank" rel="noreferrer"><strong className="text-[#c0c0e0] underline underline-offset-2 hover:text-white">{item.label}</strong></a>) : (<strong className="text-[#c0c0e0]">{item.label}</strong>)} {item.github && <a href={item.github} target="_blank" rel="noreferrer" className="text-[#555570] hover:text-[#a0a0c0] transition-colors" title="GitHub">&#8599;</a>} — {item.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 pb-16 sm:px-6 sm:pb-24">
          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-8 flex items-center gap-4 sm:mb-10">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#555570] sm:text-xs">05</span>
              <h2 className="text-lg font-semibold tracking-wide text-[#e8e8f0] sm:text-xl">Project</h2>
              <div className="h-px flex-1 bg-[#1e1e2e]" />
            </div>
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="min-w-0 rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] p-4 sm:p-6">
                <div className="mb-3 flex flex-wrap items-start gap-2 sm:mb-4 sm:items-center sm:gap-3">
                  <h3 className="text-sm font-semibold leading-snug text-[#e8e8f0] sm:text-base">{project.title}</h3>
                  <span className="rounded-full border border-[#2a2a3a] px-3 py-0.5 text-[10px] text-[#555570] sm:text-xs">
                    {project.period}
                  </span>
                </div>
                <ul className="flex flex-col gap-2">
                  {project.items.map((item) => (
                    <li key={item.label} className="flex gap-3 text-xs text-[#7070a0] leading-relaxed sm:text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3a3a5a]" />
                      <span><strong className="text-[#c0c0e0]">{item.label}</strong> — {item.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="px-5 py-8 text-center bg-[#0e0e16] sm:py-10">
        <p className="text-[10px] text-[#555570] tracking-widest uppercase sm:text-xs">
          Ajin Varghese Chandy · Full Stack Product Builder
        </p>
      </footer>
    </main>
  );
}
