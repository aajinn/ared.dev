import { cacheLife, cacheTag } from "next/cache";
import { ReviewGrid } from "./components/ReviewGrid";
import { ContactForm } from "./components/ContactForm";
import { MarkdownContent } from "./components/MarkdownContent";
import { Navbar } from "./components/Navbar";
import { getAllContent } from "@/lib/data";

export default async function Home() {
  "use cache";
  cacheLife("hours");
  cacheTag("content");

  const content = await getAllContent();
  const { sections } = content.layout;

  // Derive first name for gradient highlight
  const firstName = (content.hero.name || "Ajin").split(" ")[0];

  const sectionComponents: Record<string, () => React.ReactNode> = {
    hero: () => (
      <>
        {/* ── Navbar ── */}
        <Navbar
          name={content.hero.name}
          github={content.social.github}
          linkedin={content.social.linkedin}
          x={content.social.x}
          hireMeLabel={content.hero.hireButton?.label || "Hire Me"}
          hireMeEmail={content.email.to}
          hireMeSubject={content.email.subject}
          hireMeBody={content.email.body}
          showHireMe={content.hero.hireButton?.visible !== false}
        />

        {/* ── Hero ── */}
        <section className="flex min-h-[100svh] flex-col items-center justify-center px-5 pt-20 text-center">
          <h1 className="hero-greeting text-[clamp(2.8rem,9vw,5.5rem)] font-extrabold leading-[1.1] tracking-tight">
            <span style={{ color: "var(--color-text)" }}>Hi </span>
            <span role="img" aria-label="wave" className="inline-block animate-wave">👋</span>
            <span style={{ color: "var(--color-text)" }}>, I&apos;m </span>
            <span className="hero-name-gradient">{firstName}</span>
            <span style={{ color: "var(--color-text)" }}>.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed sm:text-lg"
            style={{ color: "var(--color-text-secondary)" }}>
            {content.hero.description}{" "}
            {content.social.github && (
              <>
                Explore{" "}
                <a href={content.social.github} target="_blank" rel="noreferrer"
                  className="underline underline-offset-2 transition hover:opacity-80"
                  style={{ color: "var(--color-accent-hover)" }}>
                  my projects
                </a>{" "}
                and{" "}
              </>
            )}
            <a
              href={`https://mail.google.com/mail/?view=cm&to=${content.email.to}&su=${content.email.subject}&body=${content.email.body}`}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 transition hover:opacity-80"
              style={{ color: "var(--color-accent-hover)" }}>
              get in touch
            </a>{" "}
            while you are here.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
            {content.hero.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border px-3 py-1 text-xs"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center gap-1" style={{ color: "var(--color-border)" }}>
            <span className="text-[10px] tracking-widest uppercase">Scroll</span>
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8" cy="7" r="2" fill="currentColor" className="animate-bounce" />
            </svg>
          </div>
        </section>
      </>
    ),
    reviews: () => (
      <section className="px-5 py-16 bg-[var(--color-surface)] sm:px-6 sm:py-24 overflow-hidden">
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
        
          {/* One card per item */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {content.experience.items.map((item) => (
              <div key={item.label}
                className="group relative flex flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5 transition-colors duration-200 hover:border-[var(--color-accent)]">
                {item.image && (
                  <div className="mb-4 overflow-hidden rounded-lg border border-[var(--color-border)]">
                    <img src={item.image} alt={item.label} className="h-36 w-full object-cover" loading="lazy" />
                  </div>
                )}
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold leading-snug text-[var(--color-text)]">{item.label}</h4>
                  <div className="relative z-10 flex shrink-0 gap-2">
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noreferrer" title="View"
                        className="rounded-full border border-red-900 px-2.5 py-0.5 text-[10px] text-red-400 transition-colors hover:border-red-500 hover:text-red-300">
                        ↗ Live
                      </a>
                    )}
                    {item.github && (
                      <a href={item.github} target="_blank" rel="noreferrer" title="GitHub"
                        className="rounded-full border border-[var(--color-border)] px-2.5 py-0.5 text-[10px] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-text)]">
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">{item.detail}</p>
                {item.cardUrl && (
                  <>
                    <p className="mt-3 text-[10px] text-[var(--color-text-muted)]">Click to open →</p>
                    {/* Stretch link covers the whole card, pills sit above via z-10 */}
                    <a href={item.cardUrl} target="_blank" rel="noreferrer" aria-label={`Open ${item.label}`}
                      className="absolute inset-0 rounded-xl" />
                  </>
                )}
              </div>
            ))}
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
            {sectionComponents[s.key]
              ? sectionComponents[s.key]?.()
              : s.content && (
                  <section className="px-5 py-16 sm:px-6 sm:py-24">
                    <div className="mx-auto max-w-3xl">
                      <h2 className="mb-8 text-lg font-semibold tracking-wide text-[var(--color-text)] sm:text-xl">{s.label}</h2>
                      <MarkdownContent content={s.content} />
                    </div>
                  </section>
                )}
          </div>
        ))}
    </main>
  );
}
