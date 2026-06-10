"use client";

type NavbarProps = {
  name: string;
  github?: string;
  linkedin?: string;
  x?: string;
  hireMeLabel?: string;
  hireMeEmail?: string;
  hireMeSubject?: string;
  hireMeBody?: string;
  showHireMe?: boolean;
};

export function Navbar({
  name,
  github,
  linkedin,
  x,
  hireMeLabel = "Hire Me",
  hireMeEmail,
  hireMeSubject = "",
  hireMeBody = "",
  showHireMe = true,
}: NavbarProps) {
  const hireMeHref = hireMeEmail
    ? `https://mail.google.com/mail/?view=cm&to=${hireMeEmail}&su=${hireMeSubject}&body=${hireMeBody}`
    : "#";
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 sm:px-10"
      style={{
        background: "var(--color-bg)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <span
        className="text-sm font-bold tracking-tight"
        style={{ color: "var(--color-text)" }}
      >
        {name}
      </span>

      <nav className="flex items-center gap-5 sm:gap-6">
        {github && (
          <NavLink href={github}>GitHub</NavLink>
        )}
        {linkedin && (
          <NavLink href={linkedin}>LinkedIn</NavLink>
        )}
        {x && (
          <NavLink href={x}>X</NavLink>
        )}
        {showHireMe && hireMeEmail && (
          <a
            href={hireMeHref}
            target="_blank"
            rel="noreferrer"
            className="rounded-full px-4 py-1.5 text-sm font-medium transition-opacity hover:opacity-80"
            style={{ background: "var(--color-text)", color: "var(--color-bg)" }}
          >
            {hireMeLabel}
          </a>
        )}
      </nav>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-sm transition-colors hover:text-[var(--color-text)]"
      style={{ color: "var(--color-text-secondary)" }}
    >
      {children}
    </a>
  );
}
