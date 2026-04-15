export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <img
        src="/giphy.gif"
        alt="Animated hero background"
        className="absolute inset-0 h-full w-full object-cover object-center brightness-75"
      />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-3xl text-center">
          <h1 className="animate-slide-left hero-name text-[clamp(2.8rem,7vw,5rem)] uppercase tracking-[0.12em] leading-[0.95]">
            <span className="hero-name-line">Ajin</span>
            <span className="hero-name-line">Varghese</span>
            <span className="hero-name-line">Chandy</span>
          </h1>
          <p className="mt-4 text-lg uppercase tracking-[0.18em] text-pink-100 opacity-85">
            Full Stack Dev
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 text-sm uppercase tracking-[0.18em] text-pink-100 opacity-85 sm:flex-row">
            <a
              href="https://github.com/aajinn"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-pink-200"
            >
              GitHub
            </a>
            <span className="hidden sm:block">•</span>
            <a
              href="https://x.com/areddev"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-pink-200"
            >
              X (Twitter)
            </a>
            <span className="hidden sm:block">•</span>
            <a
              href="https://www.linkedin.com/in/ajin-varghese-chandy-1654a4276"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-pink-200"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
