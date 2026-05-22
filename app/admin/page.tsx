"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import type {
  SiteContent,
  SkillCategory,
  Experience,
  Project,
  Hero,
  Social,
  Email,
  Footer,
  Review,
  ThemeConfig,
  Page,
  LayoutConfig,
} from "@/lib/content";
import { getDefaultContent } from "@/lib/content";

type SectionDef = {
  key: string;
  label: string;
  group: "content" | "config";
  icon: string;
};

const SECTIONS: SectionDef[] = [
  { key: "hero", label: "Hero", group: "content", icon: "H" },
  { key: "skills", label: "Skills", group: "content", icon: "S" },
  { key: "experience", label: "Experience", group: "content", icon: "E" },
  { key: "projects", label: "Projects", group: "content", icon: "P" },
  { key: "reviews", label: "Reviews", group: "content", icon: "R" },
  { key: "social", label: "Social Links", group: "config", icon: "@" },
  { key: "email", label: "Contact Email", group: "config", icon: "M" },
  { key: "footer", label: "Footer", group: "config", icon: "F" },
  { key: "theme", label: "Theme", group: "config", icon: "T" },
  { key: "pages", label: "Pages", group: "config", icon: "Pg" },
  { key: "layout", label: "Layout", group: "config", icon: "L" },
];

const GROUP_LABELS: Record<string, string> = {
  content: "Content",
  config: "Configuration",
};

/* ───── Editor registry ───── */

const EDITOR_MAP: Record<string, React.ComponentType<any>> = {
  hero: HeroEditor,
  skills: SkillsEditor,
  experience: ExperienceEditor,
  projects: ProjectsEditor,
  reviews: ReviewsEditor,
  social: SocialEditor,
  email: EmailEditor,
  footer: FooterEditor,
  theme: ThemeEditor,
  pages: PagesEditor,
  layout: LayoutEditor,
};

function getSectionData(section: string, content: SiteContent): any {
  switch (section) {
    case "skills": return content.skills;
    case "projects": return content.projects;
    case "reviews": return content.reviews;
    case "pages": return content.pages;
    case "hero": return content.hero;
    case "experience": return content.experience;
    case "social": return content.social;
    case "email": return content.email;
    case "footer": return content.footer;
    case "theme": return content.theme;
    case "layout": return content.layout;
    default: return {};
  }
}

function getSectionPayload(section: string, data: any): Record<string, any> {
  switch (section) {
    case "skills": return { items: data };
    case "projects": return { items: data };
    case "reviews": return { items: data };
    case "pages": return { items: data };
    default: return data;
  }
}

/* ───── Admin Login ───── */

function AdminLogin({ onLogin }: { onLogin: (key: string) => void }) {
  const [key, setKey] = useState("");
  return (
    <div className="flex min-h-svh items-center justify-center bg-[#0a0a0f] px-4">
      <form
        onSubmit={(e) => { e.preventDefault(); onLogin(key); }}
        className="w-full max-w-xs rounded-lg border border-[#2a2a3a] bg-[#0e0e16] p-6"
      >
        <h1 className="mb-4 text-center text-sm font-semibold text-[#e8e8f0]">Admin Login</h1>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Admin key"
          className="mb-3 w-full rounded border border-[#2a2a3a] bg-[#1a1a2e] px-3 py-2 text-sm text-[#e8e8f0] outline-none focus:border-[#6060a0]"
        />
        <button type="submit" className="w-full rounded bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90">
          Login
        </button>
      </form>
    </div>
  );
}

/* ───── Toast ───── */

function Toast({ status, onDismiss }: { status: { type: "success" | "error"; text: string }; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-lg px-4 py-2 text-sm shadow-lg transition-all ${
      status.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
    }`}>
      {status.text}
    </div>
  );
}

/* ───── Main Admin Page ───── */

export default function AdminPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirtySections, setDirtySections] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [mobileSection, setMobileSection] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_key");
    if (stored) setAdminKey(stored);
  }, []);

  useEffect(() => {
    if (!adminKey) return;
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => setContent(data))
      .catch(() => {
        setContent(getDefaultContent());
        setStatus({ type: "error", text: "Failed to load content — using defaults" });
        setTimeout(() => setStatus(null), 3000);
      });
  }, [adminKey]);

  const markDirty = useCallback((section: string) => {
    setDirtySections((prev) => new Set(prev).add(section));
  }, []);

  async function saveAll() {
    if (!content || dirtySections.size === 0) return;
    setSaving(true);
    setStatus(null);

    for (const section of dirtySections) {
      const data = getSectionPayload(section, getSectionData(section, content));
      try {
        const res = await fetch("/api/content", {
          method: "PUT",
          headers: { "Content-Type": "application/json", "x-admin-key": adminKey! },
          body: JSON.stringify({ section, data }),
        });
        if (!res.ok) throw new Error((await res.json()).error || "Save failed");
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        setStatus({ type: "error", text: `Failed to save ${section}: ${msg}` });
        setTimeout(() => setStatus(null), 3000);
        setSaving(false);
        return;
      }
    }

    setDirtySections(new Set());
    setStatus({ type: "success", text: "All changes saved" });
    setTimeout(() => setStatus(null), 3000);
    setSaving(false);
  }

  function handleLogin(key: string) {
    sessionStorage.setItem("admin_key", key);
    setAdminKey(key);
  }

  const filteredSections = useMemo(
    () => SECTIONS.filter((s) => s.label.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  function handleSectionUpdate(section: string, data: any) {
    setContent((p) => p ? { ...p, [section]: data } : p);
    markDirty(section);
  }

  if (!adminKey) return <AdminLogin onLogin={handleLogin} />;
  if (!content) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#0a0a0f]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#6060a0] border-t-transparent" />
          <p className="text-sm text-[#7070a0]">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  const dirtyCount = dirtySections.size;

  return (
    <div className="flex min-h-svh bg-[#0a0a0f]">
      {/* Sidebar — desktop */}
      <nav className="hidden w-56 shrink-0 border-r border-[#1e1e2e] bg-[#0e0e16] p-4 sm:flex sm:flex-col overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-sm font-semibold text-[#e8e8f0]">Admin</h1>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              className="text-[10px] uppercase tracking-wider text-[#555570] hover:text-[#e8e8f0]"
              title="View site"
            >
              View
            </a>
            <span className="text-[#2a2a3a]">|</span>
            <button
              onClick={() => { sessionStorage.removeItem("admin_key"); setAdminKey(null); }}
              className="text-[10px] uppercase tracking-wider text-[#555570] hover:text-[#e8e8f0]"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sections..."
            className="w-full rounded border border-[#2a2a3a] bg-[#1a1a2e] px-3 py-1.5 text-xs text-[#e8e8f0] outline-none placeholder:text-[#555570] focus:border-[#6060a0]"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#555570] hover:text-[#e8e8f0]"
            >
              x
            </button>
          )}
        </div>

        {/* Section groups */}
        <div className="flex flex-col gap-4">
          {(["content", "config"] as const).map((group) => {
            const items = filteredSections.filter((s) => s.group === group);
            if (items.length === 0 && search) return null;
            return (
              <div key={group}>
                <p className="mb-1 px-3 text-[10px] uppercase tracking-wider text-[#3a3a4a]">{GROUP_LABELS[group]}</p>
                <div className="flex flex-col gap-0.5">
                  {items.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => { setOpenSection(openSection === s.key ? null : s.key); setMobileSection(false); }}
                      className={`flex items-center gap-2 rounded px-3 py-1.5 text-left text-xs transition ${
                        openSection === s.key
                          ? "bg-[#1a1a2e] text-[#e8e8f0]"
                          : "text-[#7070a0] hover:bg-[#12121e] hover:text-[#a0a0c0]"
                      }`}
                    >
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[9px] font-medium ${
                        openSection === s.key ? "bg-[#6060a0] text-white" : "bg-[#1a1a2e] text-[#555570]"
                      }`}>
                        {s.icon}
                      </span>
                      <span className="flex-1">{s.label}</span>
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dirtySections.has(s.key) ? "bg-amber-400" : "bg-transparent"}`} />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 border-b border-[#1e1e2e] bg-[#0e0e16] px-4 py-2 sm:hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-semibold text-[#e8e8f0]">Admin</h1>
          <div className="flex items-center gap-2">
            {dirtyCount > 0 && (
              <span className="text-xs text-amber-400">{dirtyCount}</span>
            )}
            <button
              onClick={() => setMobileSection(!mobileSection)}
              className="rounded border border-[#2a2a3a] px-2.5 py-1 text-xs text-[#7070a0]"
            >
              {mobileSection ? "Close" : "Sections"}
            </button>
            <button
              onClick={() => { sessionStorage.removeItem("admin_key"); setAdminKey(null); }}
              className="text-[10px] uppercase tracking-wider text-[#555570]"
            >
              Exit
            </button>
          </div>
        </div>
      </div>

      {/* Mobile section drawer */}
      {mobileSection && (
        <div className="fixed inset-0 top-10 z-30 bg-[#0a0a0f]/95 sm:hidden">
          <nav className="flex flex-col gap-4 overflow-y-auto p-4 pt-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sections..."
              className="w-full rounded border border-[#2a2a3a] bg-[#1a1a2e] px-3 py-2 text-sm text-[#e8e8f0] outline-none placeholder:text-[#555570] focus:border-[#6060a0]"
            />
            {(["content", "config"] as const).map((group) => {
              const items = filteredSections.filter((s) => s.group === group);
              if (items.length === 0 && search) return null;
              return (
                <div key={group}>
                  <p className="mb-1 px-1 text-[10px] uppercase tracking-wider text-[#3a3a4a]">{GROUP_LABELS[group]}</p>
                  <div className="flex flex-col gap-0.5">
                    {items.map((s) => (
                      <button
                        key={s.key}
                        onClick={() => { setOpenSection(s.key); setMobileSection(false); }}
                        className={`flex items-center gap-3 rounded px-3 py-2.5 text-left text-sm transition ${
                          openSection === s.key ? "bg-[#1a1a2e] text-[#e8e8f0]" : "text-[#7070a0] hover:bg-[#12121e]"
                        }`}
                      >
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-medium ${
                          openSection === s.key ? "bg-[#6060a0] text-white" : "bg-[#1a1a2e] text-[#555570]"
                        }`}>
                          {s.icon}
                        </span>
                        <span className="flex-1">{s.label}</span>
                        <span className={`h-2 w-2 rounded-full ${dirtySections.has(s.key) ? "bg-amber-400" : "bg-transparent"}`} />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main */}
      <main className={`flex-1 overflow-y-auto px-4 py-6 sm:px-8 ${mobileSection ? "hidden sm:block" : ""}`}
        style={{ paddingTop: "3.5rem" }}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            {dirtyCount > 0 ? (
              <p className="text-xs text-amber-400">{dirtyCount} unsaved section{dirtyCount > 1 ? "s" : ""}</p>
            ) : (
              <p className="text-xs text-[#555570]">All changes saved</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {dirtyCount > 0 && (
              <button
                onClick={saveAll}
                disabled={saving}
                className="rounded bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50"
              >
                {saving ? "Saving..." : `Save All (${dirtyCount})`}
              </button>
            )}
            <a
              href="/"
              target="_blank"
              className="hidden sm:inline rounded border border-[#2a2a3a] px-3 py-1.5 text-xs text-[#7070a0] transition hover:border-[#6060a0] hover:text-[#e8e8f0]"
            >
              View site
            </a>
          </div>
        </div>

        {/* Sections */}
        <div className="mx-auto max-w-2xl">
          {filteredSections.length === 0 && search && (
            <p className="text-center text-sm text-[#555570] py-12">No sections matching &quot;{search}&quot;</p>
          )}
          {filteredSections.map(({ key, label }) => {
            const Editor = EDITOR_MAP[key];
            const sectionData = getSectionData(key, content);
            return (
              <CollapsibleSection
                key={key}
                label={label}
                section={key}
                isOpen={openSection === key}
                onToggle={() => setOpenSection(openSection === key ? null : key)}
                dirty={dirtySections.has(key)}
              >
                <Editor 
                  {...(Editor === PagesEditor ? { pages: sectionData, onUpdate: (data: any) => handleSectionUpdate("pages", data) } : {})}
                  {...(Editor === SkillsEditor ? { skills: sectionData, onUpdate: (data: any) => handleSectionUpdate("skills", data) } : {})}
                  {...(Editor === ExperienceEditor ? { experience: sectionData, onUpdate: (data: any) => handleSectionUpdate("experience", data) } : {})}
                  {...(Editor === ProjectsEditor ? { projects: sectionData, onUpdate: (data: any) => handleSectionUpdate("projects", data) } : {})}
                  {...(Editor === ReviewsEditor ? { reviews: sectionData, onUpdate: (data: any) => handleSectionUpdate("reviews", data) } : {})}
                  {...(Editor === HeroEditor ? { hero: sectionData, onUpdate: (data: any) => handleSectionUpdate("hero", data) } : {})}
                  {...(Editor === SocialEditor ? { social: sectionData, onUpdate: (data: any) => handleSectionUpdate("social", data) } : {})}
                  {...(Editor === EmailEditor ? { email: sectionData, onUpdate: (data: any) => handleSectionUpdate("email", data) } : {})}
                  {...(Editor === FooterEditor ? { footer: sectionData, onUpdate: (data: any) => handleSectionUpdate("footer", data) } : {})}
                  {...(Editor === ThemeEditor ? { theme: sectionData, onUpdate: (data: any) => handleSectionUpdate("theme", data) } : {})}
                  {...(Editor === LayoutEditor ? { layout: sectionData, onUpdate: (data: any) => handleSectionUpdate("layout", data) } : {})}
                />
              </CollapsibleSection>
            );
          })}
        </div>
      </main>

      {/* Toast */}
      {status && <Toast status={status} onDismiss={() => setStatus(null)} />}
    </div>
  );
}

/* ───── Collapsible Wrapper ───── */

function CollapsibleSection({
  label,
  section,
  isOpen,
  onToggle,
  dirty,
  children,
}: {
  label: string;
  section: string;
  isOpen: boolean;
  onToggle: () => void;
  dirty: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3 rounded-lg border border-[#1e1e2e] bg-[#0e0e16] overflow-hidden">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-3 text-left transition hover:bg-[#12121e]"
      >
        <div className="flex items-center gap-2">
          {dirty && <span className="h-2 w-2 rounded-full bg-amber-400" />}
          <span className={`text-sm font-medium ${dirty ? "text-amber-300" : "text-[#e8e8f0]"}`}>
            {label}
          </span>
        </div>
        <svg
          className={`h-4 w-4 text-[#555570] transition ${isOpen ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="border-t border-[#1e1e2e] px-5 py-4">{children}</div>}
    </div>
  );
}

/* ───── Shared UI ───── */

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#555570]">{label}</label>
      <input
        className="w-full rounded border border-[#2a2a3a] bg-[#1a1a2e] px-3 py-2 text-sm text-[#e8e8f0] outline-none transition focus:border-[#6060a0] placeholder:text-[#555570]"
        {...props}
      />
    </div>
  );
}

function Textarea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#555570]">{label}</label>
      <textarea
        className="w-full rounded border border-[#2a2a3a] bg-[#1a1a2e] px-3 py-2 text-sm text-[#e8e8f0] outline-none transition focus:border-[#6060a0] placeholder:text-[#555570] resize-y"
        {...props}
      />
    </div>
  );
}

/* ───── Section Editors ───── */

function SkillsEditor({
  skills,
  onUpdate,
}: {
  skills: SkillCategory[];
  onUpdate: (skills: SkillCategory[]) => void;
}) {
  function updateCategory(index: number, field: string, value: string) {
    const next = skills.map((cat, i) => {
      if (i !== index) return cat;
      if (field === "category") return { ...cat, category: value };
      return { ...cat, items: value.split(",").map((s) => s.trim()) };
    });
    onUpdate(next);
  }

  return (
    <div className="flex flex-col gap-3">
      {skills.map((cat, i) => (
        <div key={i} className="rounded border border-[#2a2a3a] bg-[#0a0a0f] p-3">
          <div className="mb-2 flex items-center gap-2">
            <input
              className="flex-1 rounded border border-[#2a2a3a] bg-[#1a1a2e] px-2 py-1 text-xs text-[#e8e8f0] outline-none focus:border-[#6060a0]"
              value={cat.category}
              onChange={(e) => updateCategory(i, "category", e.target.value)}
              placeholder="Category name"
            />
            <button onClick={() => onUpdate(skills.filter((_, j) => j !== i))} className="text-xs text-red-400 hover:text-red-300">Remove</button>
          </div>
          <input
            className="w-full rounded border border-[#2a2a3a] bg-[#1a1a2e] px-2 py-1 text-xs text-[#e8e8f0] outline-none focus:border-[#6060a0]"
            value={cat.items.join(", ")}
            onChange={(e) => updateCategory(i, "items", e.target.value)}
            placeholder="Comma-separated skills"
          />
        </div>
      ))}
      <button
        onClick={() => onUpdate([...skills, { category: "", items: [] }])}
        className="self-start text-xs text-[#7070a0] hover:text-[#a0a0c0]"
      >
        + Add category
      </button>
    </div>
  );
}

function HeroEditor({
  hero,
  onUpdate,
}: {
  hero: Hero;
  onUpdate: (hero: Hero) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Input label="Subtitle" value={hero.subtitle} onChange={(e) => onUpdate({ ...hero, subtitle: e.target.value })} />
      <Textarea label="Description" rows={2} value={hero.description} onChange={(e) => onUpdate({ ...hero, description: e.target.value })} />
      <Input label="Tags (comma-separated)" value={hero.tags.join(", ")} onChange={(e) => onUpdate({ ...hero, tags: e.target.value.split(",").map((s) => s.trim()) })} />
    </div>
  );
}

function ExperienceEditor({
  experience,
  onUpdate,
}: {
  experience: Experience;
  onUpdate: (exp: Experience) => void;
}) {
  function updateItem(index: number, field: string, value: string) {
    const items = experience.items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    onUpdate({ ...experience, items });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Input label="Role" value={experience.role} onChange={(e) => onUpdate({ ...experience, role: e.target.value })} />
        <Input label="Period" value={experience.period} onChange={(e) => onUpdate({ ...experience, period: e.target.value })} />
      </div>
      <Textarea label="Description" rows={2} value={experience.description} onChange={(e) => onUpdate({ ...experience, description: e.target.value })} />
      <div>
        <p className="mb-2 text-[10px] uppercase tracking-wider text-[#555570]">Items</p>
        <div className="flex flex-col gap-2">
          {experience.items.map((item, i) => (
            <div key={i} className="rounded border border-[#2a2a3a] bg-[#0a0a0f] p-3">
              <div className="mb-2 grid grid-cols-3 gap-2">
                <input className="rounded border border-[#2a2a3a] bg-[#1a1a2e] px-2 py-1 text-xs text-[#e8e8f0] outline-none focus:border-[#6060a0]" value={item.label} onChange={(e) => updateItem(i, "label", e.target.value)} placeholder="Label" />
                <input className="rounded border border-[#2a2a3a] bg-[#1a1a2e] px-2 py-1 text-xs text-[#e8e8f0] outline-none focus:border-[#6060a0]" value={item.url || ""} onChange={(e) => updateItem(i, "url", e.target.value)} placeholder="URL" />
                <div className="flex gap-2">
                  <input className="flex-1 rounded border border-[#2a2a3a] bg-[#1a1a2e] px-2 py-1 text-xs text-[#e8e8f0] outline-none focus:border-[#6060a0]" value={item.github || ""} onChange={(e) => updateItem(i, "github", e.target.value)} placeholder="GitHub" />
                  <button onClick={() => onUpdate({ ...experience, items: experience.items.filter((_, j) => j !== i) })} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                </div>
              </div>
              <textarea className="w-full rounded border border-[#2a2a3a] bg-[#1a1a2e] px-2 py-1 text-xs text-[#e8e8f0] outline-none focus:border-[#6060a0] resize-y" rows={2} value={item.detail} onChange={(e) => updateItem(i, "detail", e.target.value)} placeholder="Detail" />
            </div>
          ))}
          <button onClick={() => onUpdate({ ...experience, items: [...experience.items, { label: "", detail: "" }] })} className="self-start text-xs text-[#7070a0] hover:text-[#a0a0c0]">
            + Add item
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectsEditor({
  projects,
  onUpdate,
}: {
  projects: Project[];
  onUpdate: (projects: Project[]) => void;
}) {
  function confirmRemove(index: number) {
    if (window.confirm(`Remove "${projects[index].title || "untitled"}"?`)) {
      onUpdate(projects.filter((_, i) => i !== index));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {projects.map((project, pi) => (
        <div key={pi} className="rounded-lg border border-[#2a2a3a] bg-[#0a0a0f] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-[#555570]">Project {pi + 1}</span>
            <button onClick={() => confirmRemove(pi)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
          </div>
          <div className="mb-3 grid grid-cols-2 gap-3">
            <Input label="Title" value={project.title} onChange={(e) => onUpdate(projects.map((p, i) => i === pi ? { ...p, title: e.target.value } : p))} />
            <Input label="Period" value={project.period} onChange={(e) => onUpdate(projects.map((p, i) => i === pi ? { ...p, period: e.target.value } : p))} />
          </div>
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-wider text-[#555570]">Items</p>
            <div className="flex flex-col gap-2">
              {project.items.map((item, ii) => (
                <div key={ii} className="rounded border border-[#2a2a3a] bg-[#1a1a2e] p-2">
                  <div className="mb-2 flex gap-2">
                    <input className="flex-1 rounded border border-[#2a2a3a] bg-[#0a0a0f] px-2 py-1 text-xs text-[#e8e8f0] outline-none focus:border-[#6060a0]" value={item.label} onChange={(e) => onUpdate(projects.map((p, i) => i === pi ? { ...p, items: p.items.map((it, j) => j === ii ? { ...it, label: e.target.value } : it) } : p))} placeholder="Label" />
                    <button onClick={() => onUpdate(projects.map((p, i) => i === pi ? { ...p, items: p.items.filter((_, j) => j !== ii) } : p))} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                  </div>
                  <textarea className="w-full rounded border border-[#2a2a3a] bg-[#0a0a0f] px-2 py-1 text-xs text-[#e8e8f0] outline-none focus:border-[#6060a0] resize-y" rows={2} value={item.detail} onChange={(e) => onUpdate(projects.map((p, i) => i === pi ? { ...p, items: p.items.map((it, j) => j === ii ? { ...it, detail: e.target.value } : it) } : p))} placeholder="Detail" />
                  </div>
              ))}
              <button onClick={() => onUpdate(projects.map((p, i) => i === pi ? { ...p, items: [...p.items, { label: "", detail: "" }] } : p))} className="self-start text-xs text-[#7070a0] hover:text-[#a0a0c0]">
                + Add item
              </button>
            </div>
          </div>
        </div>
      ))}
      <button onClick={() => onUpdate([...projects, { title: "", period: "", items: [{ label: "", detail: "" }] }])} className="self-start text-xs text-[#7070a0] hover:text-[#a0a0c0]">
        + Add project
      </button>
    </div>
  );
}

function SocialEditor({
  social,
  onUpdate,
}: {
  social: Social;
  onUpdate: (s: Social) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {(["github", "linkedin", "x"] as const).map((platform) => (
        <Input key={platform} label={platform} value={social[platform]} onChange={(e) => onUpdate({ ...social, [platform]: e.target.value })} />
      ))}
    </div>
  );
}

function EmailEditor({
  email,
  onUpdate,
}: {
  email: Email;
  onUpdate: (e: Email) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Input label="Recipient Email" value={email.to} onChange={(e) => onUpdate({ ...email, to: e.target.value })} />
      <div>
        <Input label="Subject Template" value={email.subject} onChange={(e) => onUpdate({ ...email, subject: e.target.value })} />
        <p className="mt-1 text-[10px] text-[#555570]">Use %email% as a placeholder for the sender&apos;s address</p>
      </div>
    </div>
  );
}

function FooterEditor({
  footer,
  onUpdate,
}: {
  footer: Footer;
  onUpdate: (f: Footer) => void;
}) {
  return <Input label="Footer Text" value={footer.text} onChange={(e) => onUpdate({ ...footer, text: e.target.value })} />;
}

function ReviewsEditor({
  reviews,
  onUpdate,
}: {
  reviews: Review[];
  onUpdate: (r: Review[]) => void;
}) {
  function confirmRemove(index: number) {
    if (window.confirm(`Remove review by "${reviews[index].author}"?`)) {
      onUpdate(reviews.filter((_, i) => i !== index));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review, i) => (
        <div key={i} className="rounded-lg border border-[#2a2a3a] bg-[#0a0a0f] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-[#555570]">Review {i + 1}</span>
            <button onClick={() => confirmRemove(i)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
          </div>
          <div className="mb-3 grid grid-cols-2 gap-3">
            <Input label="Author" value={review.author} onChange={(e) => onUpdate(reviews.map((r, j) => j === i ? { ...r, author: e.target.value } : r))} />
            <Input label="Date" value={review.date} onChange={(e) => onUpdate(reviews.map((r, j) => j === i ? { ...r, date: e.target.value } : r))} />
          </div>
          <Textarea label="Text" rows={3} value={review.text} onChange={(e) => onUpdate(reviews.map((r, j) => j === i ? { ...r, text: e.target.value } : r))} />
          <div className="mt-3 grid grid-cols-3 gap-3">
            <Input label="Rating (1-5)" type="number" min={1} max={5} value={review.rating} onChange={(e) => onUpdate(reviews.map((r, j) => j === i ? { ...r, rating: Number(e.target.value) } : r))} />
            <Input label="Helpful count" type="number" min={0} value={review.helpful ?? ""} onChange={(e) => onUpdate(reviews.map((r, j) => j === i ? { ...r, helpful: e.target.value ? Number(e.target.value) : undefined } : r))} />
            <div className="flex items-end pb-1">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-[#7070a0]">
                <input type="checkbox" checked={review.isDeveloper || false} onChange={(e) => onUpdate(reviews.map((r, j) => j === i ? { ...r, isDeveloper: e.target.checked } : r))} className="accent-emerald-500" />
                Developer reply
              </label>
            </div>
          </div>
        </div>
      ))}
      <button onClick={() => onUpdate([...reviews, { author: "", rating: 5, date: "", text: "" }])} className="self-start text-xs text-[#7070a0] hover:text-[#a0a0c0]">
        + Add review
      </button>
    </div>
  );
}

/* ───── Theme Editor ───── */

const THEME_COLORS: { key: keyof ThemeConfig; label: string }[] = [
  { key: "background", label: "Background" },
  { key: "surface", label: "Surface" },
  { key: "surfaceAlt", label: "Surface Alt" },
  { key: "border", label: "Border" },
  { key: "textPrimary", label: "Text Primary" },
  { key: "textSecondary", label: "Text Secondary" },
  { key: "textMuted", label: "Text Muted" },
  { key: "accent", label: "Accent" },
  { key: "accentHover", label: "Accent Hover" },
  { key: "primary", label: "Primary" },
];

function ThemeEditor({
  theme,
  onUpdate,
}: {
  theme: ThemeConfig;
  onUpdate: (t: ThemeConfig) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-2 text-[10px] uppercase tracking-wider text-[#555570]">Mode</p>
        <div className="flex gap-2">
          {(["dark", "light"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => onUpdate({ ...theme, mode })}
              className={`rounded px-4 py-1.5 text-xs font-medium transition ${
                theme.mode === mode
                  ? "bg-[#6060a0] text-white"
                  : "bg-[#1a1a2e] text-[#7070a0] hover:text-[#e8e8f0]"
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {THEME_COLORS.map(({ key, label }) => (
        <div key={key}>
          <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#555570]">{label}</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={theme[key] as string}
              onChange={(e) => onUpdate({ ...theme, [key]: e.target.value })}
              className="h-8 w-8 cursor-pointer rounded border border-[#2a2a3a] bg-transparent"
            />
            <input
              value={theme[key] as string}
              onChange={(e) => onUpdate({ ...theme, [key]: e.target.value })}
              className="flex-1 rounded border border-[#2a2a3a] bg-[#1a1a2e] px-3 py-1.5 text-xs text-[#e8e8f0] outline-none focus:border-[#6060a0] font-mono"
              placeholder="#000000"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ───── Pages Editor ───── */

function PagesEditor({
  pages,
  onUpdate,
}: {
  pages: Page[];
  onUpdate: (p: Page[]) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPage, setNewPage] = useState(false);

  function addPage() {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    onUpdate([...pages, { id, slug: "", title: "", content: "", published: false, createdAt: now, updatedAt: now }]);
    setEditingId(id);
    setNewPage(false);
  }

  function updatePage(id: string, field: string, value: any) {
    onUpdate(pages.map((p) => p.id === id ? { ...p, [field]: value, updatedAt: new Date().toISOString() } : p));
  }

  function removePage(id: string) {
    const page = pages.find((p) => p.id === id);
    if (page && window.confirm(`Remove page "${page.title || "untitled"}"?`)) {
      onUpdate(pages.filter((p) => p.id !== id));
      if (editingId === id) setEditingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {pages.map((page) => (
        <div key={page.id} className="rounded-lg border border-[#2a2a3a] bg-[#0a0a0f] overflow-hidden">
          <button
            onClick={() => setEditingId(editingId === page.id ? null : page.id)}
            className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-[#12121e]"
          >
            <div className="flex items-center gap-3">
              <span className={`h-2 w-2 rounded-full ${page.published ? "bg-emerald-500" : "bg-[#555570]"}`} />
              <span className="text-sm text-[#e8e8f0]">{page.title || "Untitled"}</span>
              {page.slug && <span className="text-[10px] text-[#555570]">/{page.slug}</span>}
            </div>
            <svg
              className={`h-3 w-3 text-[#555570] transition ${editingId === page.id ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {editingId === page.id && (
            <div className="border-t border-[#2a2a3a] px-4 py-4 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <Input label="Title" value={page.title} onChange={(e) => updatePage(page.id, "title", e.target.value)} />
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Input
                        label="Slug"
                        value={page.slug}
                        onChange={(e) => updatePage(page.id, "slug", e.target.value.replace(/[^a-z0-9-]/g, ""))}
                      />
                    </div>
                    {page.slug && (
                      <a
                        href={`/${page.slug}`}
                        target="_blank"
                        className="mt-5 inline-flex items-center gap-1 rounded border border-[#2a2a3a] px-2 py-1.5 text-[10px] text-[#7070a0] hover:border-[#6060a0] hover:text-[#e8e8f0] transition shrink-0"
                        title="Preview page"
                      >
                        Open
                      </a>
                    )}
                  </div>
                  {page.slug && (
                    <p className="mt-1 text-[10px] text-[#555570]">/{page.slug}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#555570]">Content (HTML)</label>
                <textarea
                  value={page.content}
                  onChange={(e) => updatePage(page.id, "content", e.target.value)}
                  rows={8}
                  className="w-full rounded border border-[#2a2a3a] bg-[#1a1a2e] px-3 py-2 text-xs text-[#e8e8f0] outline-none focus:border-[#6060a0] font-mono resize-y"
                  placeholder="<h2>About Me</h2><p>Write HTML content here...</p>"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-[#7070a0]">
                  <input
                    type="checkbox"
                    checked={page.published}
                    onChange={(e) => updatePage(page.id, "published", e.target.checked)}
                    className="accent-emerald-500"
                  />
                  Published
                </label>
                <button onClick={() => removePage(page.id)} className="text-xs text-red-400 hover:text-red-300">
                  Delete page
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      <button onClick={addPage} className="self-start text-xs text-[#7070a0] hover:text-[#a0a0c0]">
        + Add page
      </button>
    </div>
  );
}

/* ───── Layout Editor ───── */

function LayoutEditor({
  layout,
  onUpdate,
}: {
  layout: LayoutConfig;
  onUpdate: (l: LayoutConfig) => void;
}) {
  function moveSection(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= layout.sections.length) return;
    const next = [...layout.sections];
    [next[index], next[target]] = [next[target], next[index]];
    onUpdate({ ...layout, sections: next });
  }

  function toggleVisibility(index: number) {
    const next = layout.sections.map((s, i) =>
      i === index ? { ...s, visible: !s.visible } : s
    );
    onUpdate({ ...layout, sections: next });
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] uppercase tracking-wider text-[#555570] mb-1">
        Reorder sections &amp; toggle visibility
      </p>
      {layout.sections.map((section, i) => (
        <div
          key={section.key}
          className="flex items-center gap-2 rounded-lg border border-[#2a2a3a] bg-[#0a0a0f] px-3 py-2"
        >
          <button
            onClick={() => moveSection(i, -1)}
            disabled={i === 0}
            className="text-[#555570] hover:text-[#e8e8f0] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            onClick={() => moveSection(i, 1)}
            disabled={i === layout.sections.length - 1}
            className="text-[#555570] hover:text-[#e8e8f0] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            onClick={() => toggleVisibility(i)}
            className={`text-xs ${section.visible ? "text-emerald-400" : "text-[#555570]"}`}
          >
            {section.visible ? "ON" : "OFF"}
          </button>
          <span className={`text-sm ${section.visible ? "text-[#e8e8f0]" : "text-[#555570] line-through"}`}>
            {section.label}
          </span>
        </div>
      ))}
    </div>
  );
}
