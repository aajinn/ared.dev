import { cacheLife } from "next/cache";
import { ReviewGrid } from "./components/ReviewGrid";
import { ReviewScroll } from "./components/ReviewScroll";
import { HireMeButton } from "./components/HireMeButton";
import { ContactForm } from "./components/ContactForm";
import { getAllContent } from "@/lib/data";

export default async function Home() {
  "use cache";
  cacheLife("max");

  const content = await getAllContent();

  return (
    <main className="relative bg-[#0a0a0f] text-[#e8e8f0] overflow-x-hidden">
      {/* Hero + Reviews side-by-side on desktop */}
      <section className="flex min-h-[100svh] flex-col items-center justify-center px-5 text-center lg:flex-row lg:items-center lg:justify-center lg:gap-16 lg:px-16 lg:text-left xl:px-24">

        {/* Left: hero text */}
        <div className="flex flex-col items-center text-center lg:items-start lg:flex-1 lg:text-left">
          <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#555570] sm:text-xs">
            {content.hero.subtitle}
          </p>
          <h1 className="animate-slide-left hero-name text-[clamp(2.4rem,10vw,5.5rem)] uppercase tracking-[0.08em] leading-[0.95] text-[#f0f0ff]">
            <span className="hero-name-line">Ajin</span>
            <span className="hero-name-line">Varghese</span>
            <span className="hero-name-line">Chandy</span>
          </h1>
          <p className="mt-5 max-w-sm px-2 text-sm text-[#7070a0] leading-relaxed lg:px-0">
            {content.hero.description}
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2 lg:justify-start">
            {content.hero.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#2a2a3a] px-3 py-1 text-xs text-[#7070a0] whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>

          <HireMeButton email={content.email.to} />

          {/* Social links */}
          <div className="mt-4 flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4 lg:justify-start">
            <a href={content.social.github} target="_blank" rel="noreferrer"
              className="rounded border border-[#2a2a3a] py-3 text-center text-xs uppercase tracking-[0.18em] text-[#7070a0] transition hover:border-[#6060a0] hover:text-[#e8e8f0] sm:px-5 sm:py-2">
              GitHub
            </a>
            <a href={content.social.linkedin} target="_blank" rel="noreferrer"
              className="rounded border border-[#2a2a3a] py-3 text-center text-xs uppercase tracking-[0.18em] text-[#7070a0] transition hover:border-[#6060a0] hover:text-[#e8e8f0] sm:px-5 sm:py-2">
              LinkedIn
            </a>
            <a href={content.social.x} target="_blank" rel="noreferrer"
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
        {content.reviews.length > 0 && (
          <div className="hidden lg:block lg:w-80 xl:w-96 lg:shrink-0">
            <ReviewScroll reviews={content.reviews} />
          </div>
        )}
      </section>

      {/* Reviews — mobile only */}
      {content.reviews.length > 0 && (
        <section className="px-5 py-16 bg-[#0e0e16] lg:hidden sm:px-6 sm:py-24 overflow-hidden">
          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-8 flex items-center gap-4 sm:mb-10">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#555570] sm:text-xs">02</span>
              <h2 className="text-lg font-semibold tracking-wide text-[#e8e8f0] sm:text-xl">Reviews</h2>
              <div className="h-px flex-1 bg-[#1e1e2e]" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              <ReviewGrid
                reviews={content.reviews}
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
              {content.skills.map(({ category, items }) => (
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
                  <h3 className="text-sm font-semibold leading-snug text-[#e8e8f0] sm:text-base">{content.experience.role}</h3>
                  <span className="rounded-full border border-[#2a2a3a] px-3 py-0.5 text-[10px] text-[#555570] sm:text-xs">
                    {content.experience.period}
                  </span>
                </div>
                <p className="mb-3 text-xs text-[#7070a0] leading-relaxed sm:text-sm">{content.experience.description}</p>
                <ul className="flex flex-col gap-2">
                  {content.experience.items.map((item) => (
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
              <h2 className="text-lg font-semibold tracking-wide text-[#e8e8f0] sm:text-xl">Projects</h2>
              <div className="h-px flex-1 bg-[#1e1e2e]" />
            </div>
            <div className="flex flex-col gap-4 sm:gap-6">
              {content.projects.map((project) => (
                <div key={project.title} className="min-w-0 rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] p-4 sm:p-6">
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
              ))}
            </div>
          </div>
        </section>
        <section className="px-5 pb-16 sm:px-6 sm:pb-24">
          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-8 flex items-center gap-4 sm:mb-10">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#555570] sm:text-xs">06</span>
              <h2 className="text-lg font-semibold tracking-wide text-[#e8e8f0] sm:text-xl">Contact</h2>
              <div className="h-px flex-1 bg-[#1e1e2e]" />
            </div>
            <div className="rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] p-5 sm:p-6">
              <ContactForm />
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="px-5 py-8 text-center bg-[#0e0e16] sm:py-10">
        <p className="text-[10px] text-[#555570] tracking-widest uppercase sm:text-xs">
          {content.footer.text}
        </p>
      </footer>
    </main>
  );
}
