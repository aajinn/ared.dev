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
  const { sections } = content.layout;

  const sectionComponents: Record<string, () => React.ReactNode> = {
    hero: () => (
      <section className="flex min-h-[100svh] flex-col items-center justify-center px-5 text-center lg:flex-row lg:items-center lg:justify-center lg:gap-16 lg:px-16 lg:text-left xl:px-24">
        <div className="flex flex-col items-center text-center lg:items-start lg:flex-1 lg:text-left">
          <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-muted)] sm:text-xs">
            {content.hero.subtitle}
          </p>
          <h1 className="animate-slide-left hero-name text-[clamp(2.4rem,10vw,5.5rem)] uppercase tracking-[0.08em] leading-[0.95] text-[var(--color-text)]">
            <span className="hero-name-line">Ajin</span>
            <span className="hero-name-line">Varghese</span>
            <span className="hero-name-line">Chandy</span>
          </h1>
          <p className="mt-5 max-w-sm px-2 text-sm text-[var(--color-text-secondary)] leading-relaxed lg:px-0">
            {content.hero.description}
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2 lg:justify-start">
            {content.hero.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-secondary)] whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
          <HireMeButton email={content.email.to} />
          <div className="mt-4 flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4 lg:justify-start">
            <a href={content.social.github} target="_blank" rel="noreferrer"
              className="rounded border border-[var(--color-border)] py-3 text-center text-xs uppercase tracking-[0.18em] text-[var(--color-text-secondary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-text)] sm:px-5 sm:py-2">
              GitHub
            </a>
            <a href={content.social.linkedin} target="_blank" rel="noreferrer"
              className="rounded border border-[var(--color-border)] py-3 text-center text-xs uppercase tracking-[0.18em] text-[var(--color-text-secondary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-text)] sm:px-5 sm:py-2">
              LinkedIn
            </a>
            <a href={content.social.x} target="_blank" rel="noreferrer"
              className="rounded border border-[var(--color-border)] py-3 text-center text-xs uppercase tracking-[0.18em] text-[var(--color-text-secondary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-text)] sm:px-5 sm:py-2">
              X (Twitter)
            </a>
          </div>
          <div className="mt-12 flex flex-col items-center gap-1 text-[var(--color-border)] lg:hidden">
            <span className="text-[10px] tracking-widest uppercase">Scroll</span>
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8" cy="7" r="2" fill="currentColor" className="animate-bounce" />
            </svg>
          </div>
        </div>
        {content.reviews.length > 0 && (
          <div className="hidden lg:block lg:w-80 xl:w-96 lg:shrink-0">
            <ReviewScroll reviews={content.reviews} />
          </div>
        )}
      </section>
    ),
    reviews: () => (
      <section className="px-5 py-16 bg-[var(--color-surface)] lg:hidden sm:px-6 sm:py-24 overflow-hidden">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-8 flex items-center gap-4 sm:mb-10">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-muted)] sm:text-xs">02</span>
            <h2 className="text-lg font-semibold tracking-wide text-[var(--color-text)] sm:text-xl">Reviews</h2>
            <div className="h-px flex-1 bg-[var(--color-border)]" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <ReviewGrid reviews={content.reviews} columns={2} />
          </div>
        </div>
      </section>
    ),
    skills: () => (
      <section className="px-5 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-8 flex items-center gap-4 sm:mb-10">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-muted)] sm:text-xs">03</span>
            <h2 className="text-lg font-semibold tracking-wide text-[var(--color-text)] sm:text-xl">Skills</h2>
            <div className="h-px flex-1 bg-[var(--color-border)]" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            {content.skills.map(({ category, items }) => (
              <div key={category} className="min-w-0 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4 sm:p-5">
                <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] sm:text-xs">{category}</p>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <span key={item} className="rounded-full bg-[var(--color-surface-alt)] px-3 py-1 text-xs text-[var(--color-text-secondary)] sm:text-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    experience: () => (
      <section className="px-5 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-8 flex items-center gap-4 sm:mb-10">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-muted)] sm:text-xs">04</span>
            <h2 className="text-lg font-semibold tracking-wide text-[var(--color-text)] sm:text-xl">Technical Experience</h2>
            <div className="h-px flex-1 bg-[var(--color-border)]" />
          </div>
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="min-w-0 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4 sm:p-6">
              <div className="mb-3 flex flex-wrap items-start gap-2 sm:mb-4 sm:items-center sm:gap-3">
                <h3 className="text-sm font-semibold leading-snug text-[var(--color-text)] sm:text-base">{content.experience.role}</h3>
                <span className="rounded-full border border-[var(--color-border)] px-3 py-0.5 text-[10px] text-[var(--color-text-muted)] sm:text-xs">
                  {content.experience.period}
                </span>
              </div>
              <p className="mb-3 text-xs text-[var(--color-text-secondary)] leading-relaxed sm:text-sm">{content.experience.description}</p>
              <ul className="flex flex-col gap-2">
                {content.experience.items.map((item) => (
                  <li key={item.label} className="flex gap-3 text-xs text-[var(--color-text-secondary)] leading-relaxed sm:text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-text-muted)]" />
                    <span>{item.url ? (<a href={item.url} target="_blank" rel="noreferrer"><strong className="text-[var(--color-text)] underline underline-offset-2 hover:text-[var(--color-text)]">{item.label}</strong></a>) : (<strong className="text-[var(--color-text)]">{item.label}</strong>)} {item.github && <a href={item.github} target="_blank" rel="noreferrer" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors" title="GitHub">&#8599;</a>} — {item.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    ),
    projects: () => (
      <section className="px-5 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-8 flex items-center gap-4 sm:mb-10">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-muted)] sm:text-xs">05</span>
            <h2 className="text-lg font-semibold tracking-wide text-[var(--color-text)] sm:text-xl">Projects</h2>
            <div className="h-px flex-1 bg-[var(--color-border)]" />
          </div>
          <div className="flex flex-col gap-4 sm:gap-6">
            {content.projects.map((project) => (
              <div key={project.title} className="min-w-0 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4 sm:p-6">
                <div className="mb-3 flex flex-wrap items-start gap-2 sm:mb-4 sm:items-center sm:gap-3">
                  <h3 className="text-sm font-semibold leading-snug text-[var(--color-text)] sm:text-base">{project.title}</h3>
                  <span className="rounded-full border border-[var(--color-border)] px-3 py-0.5 text-[10px] text-[var(--color-text-muted)] sm:text-xs">
                    {project.period}
                  </span>
                </div>
                <ul className="flex flex-col gap-2">
                  {project.items.map((item) => (
                    <li key={item.label} className="flex gap-3 text-xs text-[var(--color-text-secondary)] leading-relaxed sm:text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-text-muted)]" />
                      <span><strong className="text-[var(--color-text)]">{item.label}</strong> — {item.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    contact: () => (
      <section className="px-5 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-8 flex items-center gap-4 sm:mb-10">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-muted)] sm:text-xs">06</span>
            <h2 className="text-lg font-semibold tracking-wide text-[var(--color-text)] sm:text-xl">Contact</h2>
            <div className="h-px flex-1 bg-[var(--color-border)]" />
          </div>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-5 sm:p-6">
            <ContactForm />
          </div>
        </div>
      </section>
    ),
    footer: () => (
      <footer className="px-5 py-8 text-center bg-[var(--color-surface)] sm:py-10">
        <p className="text-[10px] text-[var(--color-text-muted)] tracking-widest uppercase sm:text-xs">
          {content.footer.text}
        </p>
      </footer>
    ),
  };

  return (
    <main className="relative overflow-x-hidden" style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}>
      {sections
        .filter((s) => s.visible)
        .map((s) => (
          <div key={s.key} className={s.key === "skills" || s.key === "experience" || s.key === "projects" || s.key === "contact" ? "bg-[var(--color-surface)]" : ""}>
            {sectionComponents[s.key]?.()}
          </div>
        ))}
    </main>
  );
}
