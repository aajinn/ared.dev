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

export default function Home() {
  return (
    <main className="relative text-white">
      {/* Fixed video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="fixed inset-0 h-full w-full object-cover object-center brightness-75 -z-10"
      >
        <source src="/hero.webm" type="video/webm" />
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Hero */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.25em] text-white/50">
          Full Stack Developer
        </p>
        <h1 className="animate-slide-left hero-name text-[clamp(3rem,8vw,5.5rem)] uppercase tracking-[0.1em] leading-[0.95]">
          <span className="hero-name-line">Ajin</span>
          <span className="hero-name-line">Varghese</span>
          <span className="hero-name-line">Chandy</span>
        </h1>
        <p className="mt-6 max-w-md text-sm text-white/60 leading-relaxed">
          Building full-stack web applications with the MERN stack. Passionate about real-time systems and clean user experiences.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs uppercase tracking-[0.18em]">
          <a href="https://github.com/aajinn" target="_blank" rel="noreferrer"
            className="rounded border border-white/20 px-5 py-2 transition hover:border-white/60 hover:text-white text-white/70">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/ajin-varghese-chandy-1654a4276" target="_blank" rel="noreferrer"
            className="rounded border border-white/20 px-5 py-2 transition hover:border-white/60 hover:text-white text-white/70">
            LinkedIn
          </a>
          <a href="https://x.com/areddev" target="_blank" rel="noreferrer"
            className="rounded border border-white/20 px-5 py-2 transition hover:border-white/60 hover:text-white text-white/70">
            X (Twitter)
          </a>
        </div>
        <div className="mt-16 flex flex-col items-center gap-1 text-white/30">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" aria-hidden="true">
            <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="8" cy="7" r="2" fill="currentColor" className="animate-bounce"/>
          </svg>
        </div>
      </section>

      {/* Skills + Projects */}
      <div className="backdrop-blur-md bg-black/50">

      <section className="px-6 py-24">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-10 flex items-center gap-4">
            <span className="text-xs uppercase tracking-[0.25em] text-white/40">02</span>
            <h2 className="text-xl font-semibold tracking-wide">Skills</h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {skills.map(({ category, items }) => (
              <div key={category} className="rounded-lg border border-white/10 bg-white/5 p-5">
                <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/40">{category}</p>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <span key={item} className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="px-6 pb-24">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-10 flex items-center gap-4">
            <span className="text-xs uppercase tracking-[0.25em] text-white/40">03</span>
            <h2 className="text-xl font-semibold tracking-wide">Projects</h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <div className="flex flex-col gap-6">
            {projects.map((project) => (
              <div key={project.title} className="rounded-lg border border-white/10 bg-white/5 p-6">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <h3 className="text-base font-semibold">{project.title}</h3>
                  <span className="rounded-full border border-white/20 px-3 py-0.5 text-xs text-white/50">
                    {project.tag}
                  </span>
                </div>
                <ul className="flex flex-col gap-2">
                  {project.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-sm text-white/60 leading-relaxed">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/30" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      </div>{/* end Skills + Projects wrapper */}

      {/* Footer */}
      <footer className="px-6 py-10 text-center backdrop-blur-md bg-black/50">
        <p className="text-xs text-white/30 tracking-widest uppercase">
          Ajin Varghese Chandy · Full Stack Developer
        </p>
      </footer>
    </main>
  );
}
