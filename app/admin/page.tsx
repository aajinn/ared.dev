"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { MarkdownContent } from "@/app/components/MarkdownContent";
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
  { key: "social", label: "Social Links", group: "config", icon: "@" },
  { key: "email", label: "Contact Email", group: "config", icon: "M" },
  { key: "footer", label: "Footer", group: "config", icon: "F" },
  { key: "theme", label: "Theme", group: "config", icon: "T" },
  { key: "pages", label: "Pages", group: "config", icon: "Pg" },
  { key: "layout", label: "Layout", group: "config", icon: "L" },
];

const GROUP_LABELS: Record<string, string> = {
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
          {filteredSections.map((s) => (
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
            {filteredSections.map((s) => (
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
                  {...(Editor === LayoutEditor ? { layout: sectionData, onUpdate: (data: any) => handleSectionUpdate("layout", data), content, onSectionUpdate: handleSectionUpdate } : {})}
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
      <Input label="Name" value={hero.name || ""} onChange={(e) => onUpdate({ ...hero, name: e.target.value })} />
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

const THEME_PRESETS: { label: string; theme: Partial<ThemeConfig> }[] = [
  {
    label: "Midnight",
    theme: {
      mode: "dark", background: "#0a0a0f", surface: "#0e0e16", surfaceAlt: "#1a1a2e",
      border: "#1e1e2e", textPrimary: "#e8e8f0", textSecondary: "#7070a0", textMuted: "#555570",
      accent: "#6060a0", accentHover: "#8080c0", primary: "#ffffff",
    },
  },
  {
    label: "Dark",
    theme: {
      mode: "dark", background: "#000000", surface: "#0a0a0a", surfaceAlt: "#141414",
      border: "#222222", textPrimary: "#f0f0f0", textSecondary: "#888888", textMuted: "#555555",
      accent: "#a855f7", accentHover: "#c084fc", primary: "#ffffff",
    },
  },
  {
    label: "Light",
    theme: {
      mode: "light", background: "#f8f9fa", surface: "#ffffff", surfaceAlt: "#e9ecef",
      border: "#dee2e6", textPrimary: "#212529", textSecondary: "#6c757d", textMuted: "#adb5bd",
      accent: "#4361ee", accentHover: "#3a56d4", primary: "#000000",
    },
  },
  {
    label: "Forest",
    theme: {
      mode: "dark", background: "#0a120c", surface: "#0f1912", surfaceAlt: "#1a2e1e",
      border: "#2a3e2e", textPrimary: "#e0f0e0", textSecondary: "#8aa88a", textMuted: "#5a7a5a",
      accent: "#4ade80", accentHover: "#86efac", primary: "#ffffff",
    },
  },
  {
    label: "Ocean",
    theme: {
      mode: "dark", background: "#0a0f1a", surface: "#0f172a", surfaceAlt: "#1e293b",
      border: "#334155", textPrimary: "#e2e8f0", textSecondary: "#94a3b8", textMuted: "#64748b",
      accent: "#38bdf8", accentHover: "#7dd3fc", primary: "#ffffff",
    },
  },
  {
    label: "Warm",
    theme: {
      mode: "dark", background: "#1a120e", surface: "#2a1e18", surfaceAlt: "#3a2e28",
      border: "#4a3e38", textPrimary: "#f0e8e0", textSecondary: "#b0a090", textMuted: "#807060",
      accent: "#fb923c", accentHover: "#fdba74", primary: "#ffffff",
    },
  },
];

const COLOR_DEFS: { key: keyof ThemeConfig; label: string; group: string }[] = [
  { key: "background", label: "Background", group: "Base" },
  { key: "surface", label: "Surface", group: "Base" },
  { key: "surfaceAlt", label: "Surface Alt", group: "Base" },
  { key: "border", label: "Border", group: "Base" },
  { key: "textPrimary", label: "Text Primary", group: "Text" },
  { key: "textSecondary", label: "Text Secondary", group: "Text" },
  { key: "textMuted", label: "Text Muted", group: "Text" },
  { key: "accent", label: "Accent", group: "Accent" },
  { key: "accentHover", label: "Accent Hover", group: "Accent" },
  { key: "primary", label: "Primary", group: "Accent" },
];

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let r = 0, g = 0, b = 0;
  const h = hex.replace("#", "");
  if (h.length === 6) {
    r = parseInt(h.substring(0, 2), 16) / 255;
    g = parseInt(h.substring(2, 4), 16) / 255;
    b = parseInt(h.substring(4, 6), 16) / 255;
  }
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let hue = 0, sat = 0;
  const lit = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    sat = lit > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: hue = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: hue = ((b - r) / d + 2) / 6; break;
      case b: hue = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(hue * 360), s: Math.round(sat * 100), l: Math.round(lit * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function themeForMode(current: ThemeConfig, targetMode: "dark" | "light"): ThemeConfig {
  if (current.mode === targetMode) return current;
  const a = hexToHsl(current.accent);
  if (targetMode === "light") {
    return {
      ...current, mode: "light",
      background: "#f8f9fa", surface: "#ffffff", surfaceAlt: "#e9ecef", border: "#dee2e6",
      textPrimary: "#212529", textSecondary: "#6c757d", textMuted: "#adb5bd",
      accent: hslToHex(a.h, Math.min(a.s, 80), 45),
      accentHover: hslToHex(a.h, Math.min(a.s, 80), 55),
      primary: "#000000",
    };
  }
  return {
    ...current, mode: "dark",
    background: "#0a0a0f", surface: "#0e0e16", surfaceAlt: "#1a1a2e", border: "#1e1e2e",
    textPrimary: "#e8e8f0", textSecondary: "#7070a0", textMuted: "#555570",
    accent: hslToHex(a.h, Math.min(a.s, 60), 50),
    accentHover: hslToHex(a.h, Math.min(a.s, 60), 65),
    primary: "#ffffff",
  };
}

const GROUP_LABELS_THEME: Record<string, string> = {
  Base: "Background & Surfaces",
  Text: "Text Colors",
  Accent: "Accent Colors",
};

function ThemeEditor({
  theme,
  onUpdate,
}: {
  theme: ThemeConfig;
  onUpdate: (t: ThemeConfig) => void;
}) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>("Base");
  const [showPreview, setShowPreview] = useState(true);

  function loadPreset(preset: Partial<ThemeConfig>) {
    if (window.confirm("Load preset? Current unsaved changes will be overwritten.")) {
      onUpdate({ ...theme, ...preset });
    }
  }

  function resetDefaults() {
    const def = getDefaultContent().theme;
    if (window.confirm("Reset theme to defaults?")) {
      onUpdate({ ...theme, ...def });
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Presets */}
      <div>
        <p className="mb-2 text-[10px] uppercase tracking-wider text-[#555570]">Presets</p>
        <div className="flex flex-wrap gap-2">
          {THEME_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => loadPreset(preset.theme)}
              className="flex items-center gap-2 rounded border border-[#2a2a3a] bg-[#1a1a2e] px-3 py-1.5 text-xs text-[#7070a0] transition hover:border-[#6060a0] hover:text-[#e8e8f0]"
            >
              <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: preset.theme.accent }} />
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode */}
      <div>
        <p className="mb-2 text-[10px] uppercase tracking-wider text-[#555570]">Mode</p>
        <div className="flex gap-2">
          {(["dark", "light"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => onUpdate(themeForMode(theme, mode))}
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

      {/* Live Preview */}
      {showPreview && (
        <div className="rounded-lg border border-[#2a2a3a] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a2e]">
            <span className="text-[10px] uppercase tracking-wider text-[#555570]">Live Preview</span>
            <button onClick={() => setShowPreview(false)} className="text-xs text-[#555570] hover:text-[#e8e8f0]">Hide</button>
          </div>
          <div className="p-4" style={{ backgroundColor: theme.background, fontFamily: theme.fontFamily }}>
            <div className="rounded-lg border p-4" style={{ backgroundColor: theme.surface, borderColor: theme.border, borderRadius: theme.borderRadius }}>
              <h3 style={{ color: theme.textPrimary, fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>Sample Card</h3>
              <p style={{ color: theme.textSecondary, fontSize: "12px", lineHeight: "1.5", marginBottom: "12px" }}>
                This is how text looks with your current theme colors.
              </p>
              <div className="flex gap-2">
                <span style={{ backgroundColor: theme.surfaceAlt, color: theme.textSecondary, padding: "4px 10px", borderRadius: "999px", fontSize: "11px", border: `1px solid ${theme.border}` }}>
                  Tag
                </span>
                <span style={{ backgroundColor: theme.surfaceAlt, color: theme.textSecondary, padding: "4px 10px", borderRadius: "999px", fontSize: "11px", border: `1px solid ${theme.border}` }}>
                  Another
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <button style={{ backgroundColor: theme.accent, color: "#fff", padding: "6px 16px", borderRadius: theme.borderRadius, fontSize: "12px", fontWeight: 500, border: "none", cursor: "pointer" }}>
                  Primary
                </button>
                <button style={{ color: theme.textSecondary, padding: "6px 16px", borderRadius: theme.borderRadius, fontSize: "12px", border: `1px solid ${theme.border}`, cursor: "pointer", backgroundColor: "transparent" }}>
                  Secondary
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {!showPreview && (
        <button onClick={() => setShowPreview(true)} className="self-start text-xs text-[#555570] hover:text-[#e8e8f0]">Show Preview</button>
      )}

      {/* Color Palette Overview */}
      <div>
        <p className="mb-2 text-[10px] uppercase tracking-wider text-[#555570]">Palette</p>
        <div className="flex flex-wrap gap-1.5">
          {COLOR_DEFS.map(({ key, label }) => {
            const val = theme[key] as string;
            return (
              <div key={key} className="group relative">
                <div
                  className="h-8 w-8 cursor-pointer rounded border border-[#2a2a3a] transition hover:scale-110"
                  style={{ backgroundColor: val }}
                  onClick={() => setExpandedGroup(
                    COLOR_DEFS.find((c) => c.key === key)?.group || null
                  )}
                  title={label}
                />
                <div className="absolute -top-1 -right-1 hidden group-hover:block z-10">
                  <span className="whitespace-nowrap rounded bg-[#1a1a2e] px-2 py-0.5 text-[10px] text-[#e8e8f0] shadow-lg border border-[#2a2a3a]">
                    {label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Color Groups */}
      {(["Base", "Text", "Accent"] as const).map((group) => {
        const colors = COLOR_DEFS.filter((c) => c.group === group);
        const isOpen = expandedGroup === group;
        return (
          <div key={group} className="rounded-lg border border-[#1e1e2e] overflow-hidden">
            <button
              onClick={() => setExpandedGroup(isOpen ? null : group)}
              className="flex w-full items-center justify-between px-4 py-2.5 bg-[#0e0e16] transition hover:bg-[#12121e]"
            >
              <span className="text-xs font-medium text-[#e8e8f0]">{GROUP_LABELS_THEME[group]}</span>
              <svg
                className={`h-3 w-3 text-[#555570] transition ${isOpen ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isOpen && (
              <div className="border-t border-[#1e1e2e] px-4 py-4 flex flex-col gap-4">
                {colors.map(({ key, label }) => {
                  const hsl = hexToHsl(theme[key] as string);
                  return (
                    <ColorControl
                      key={key}
                      label={label}
                      hex={theme[key] as string}
                      hsl={hsl}
                      onChange={(hex) => onUpdate({ ...theme, [key]: hex })}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Style Settings */}
      <div className="rounded-lg border border-[#1e1e2e] overflow-hidden">
        <button
          onClick={() => setExpandedGroup(expandedGroup === "Style" ? null : "Style")}
          className="flex w-full items-center justify-between px-4 py-2.5 bg-[#0e0e16] transition hover:bg-[#12121e]"
        >
          <span className="text-xs font-medium text-[#e8e8f0]">Style Settings</span>
          <svg
            className={`h-3 w-3 text-[#555570] transition ${expandedGroup === "Style" ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedGroup === "Style" && (
          <div className="border-t border-[#1e1e2e] px-4 py-4 flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#555570]">Font Family</label>
              <input
                value={theme.fontFamily || ""}
                onChange={(e) => onUpdate({ ...theme, fontFamily: e.target.value })}
                className="w-full rounded border border-[#2a2a3a] bg-[#1a1a2e] px-3 py-1.5 text-xs text-[#e8e8f0] outline-none focus:border-[#6060a0] font-mono"
                placeholder="Inter, system-ui, sans-serif"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#555570]">Border Radius</label>
              <input
                value={theme.borderRadius || ""}
                onChange={(e) => onUpdate({ ...theme, borderRadius: e.target.value })}
                className="w-full rounded border border-[#2a2a3a] bg-[#1a1a2e] px-3 py-1.5 text-xs text-[#e8e8f0] outline-none focus:border-[#6060a0] font-mono"
                placeholder="12px"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#555570]">Box Shadow</label>
              <input
                value={theme.shadow || ""}
                onChange={(e) => onUpdate({ ...theme, shadow: e.target.value })}
                className="w-full rounded border border-[#2a2a3a] bg-[#1a1a2e] px-3 py-1.5 text-xs text-[#e8e8f0] outline-none focus:border-[#6060a0] font-mono"
                placeholder="0 4px 24px rgba(0,0,0,0.3)"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#555570]">Transition Duration</label>
              <input
                value={theme.transition || ""}
                onChange={(e) => onUpdate({ ...theme, transition: e.target.value })}
                className="w-full rounded border border-[#2a2a3a] bg-[#1a1a2e] px-3 py-1.5 text-xs text-[#e8e8f0] outline-none focus:border-[#6060a0] font-mono"
                placeholder="0.2s"
              />
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2">
        <button
          onClick={resetDefaults}
          className="rounded border border-[#2a2a3a] px-3 py-1.5 text-xs text-[#7070a0] transition hover:border-red-400 hover:text-red-400"
        >
          Reset to Defaults
        </button>
        <button
          onClick={() => {
            const json = JSON.stringify(theme, null, 2);
            navigator.clipboard.writeText(json);
            alert("Theme JSON copied to clipboard");
          }}
          className="rounded border border-[#2a2a3a] px-3 py-1.5 text-xs text-[#7070a0] transition hover:border-[#6060a0] hover:text-[#e8e8f0]"
        >
          Export JSON
        </button>
      </div>
    </div>
  );
}

function ColorControl({
  label,
  hex,
  hsl,
  onChange,
}: {
  label: string;
  hex: string;
  hsl: { h: number; s: number; l: number };
  onChange: (hex: string) => void;
}) {
  const [showSliders, setShowSliders] = useState(false);
  const [h, s, l] = [hsl.h, hsl.s, hsl.l];

  return (
    <div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={hex}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-7 cursor-pointer rounded border border-[#2a2a3a] bg-transparent shrink-0"
        />
        <input
          value={hex}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded border border-[#2a2a3a] bg-[#1a1a2e] px-2 py-1 text-xs text-[#e8e8f0] outline-none focus:border-[#6060a0] font-mono"
          placeholder="#000000"
        />
        <button
          onClick={() => setShowSliders(!showSliders)}
          className={`text-[10px] px-2 py-1 rounded transition ${
            showSliders ? "text-[#6060a0]" : "text-[#555570] hover:text-[#e8e8f0]"
          }`}
        >
          HSL
        </button>
      </div>
      {showSliders && (
        <div className="mt-2 flex flex-col gap-1.5 pl-1">
          <Slider label="H" value={h} max={360} onChange={(v) => onChange(hslToHex(v, s, l))} />
          <Slider label="S" value={s} max={100} onChange={(v) => onChange(hslToHex(h, v, l))} />
          <Slider label="L" value={l} max={100} onChange={(v) => onChange(hslToHex(h, s, v))} />
        </div>
      )}
    </div>
  );
}

function Slider({
  label,
  value,
  max,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-4 text-[10px] text-[#555570] font-mono">{label}</span>
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-1 accent-[#6060a0] cursor-pointer"
      />
      <span className="w-8 text-right text-[10px] text-[#7070a0] font-mono">{value}</span>
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
  const [contentEditorId, setContentEditorId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [preview, setPreview] = useState(false);
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

  function openContentEditor(id: string) {
    const page = pages.find((p) => p.id === id);
    if (!page) return;
    setEditedContent(page.content);
    setContentEditorId(id);
    setPreview(false);
  }

  function saveContent() {
    if (contentEditorId) {
      updatePage(contentEditorId, "content", editedContent);
      setContentEditorId(null);
      setEditedContent("");
    }
  }

  function closeContentEditor() {
    setContentEditorId(null);
    setEditedContent("");
    setPreview(false);
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
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#555570]">Content</label>
                <button
                  type="button"
                  onClick={() => openContentEditor(page.id)}
                  className="w-full rounded border border-[#2a2a3a] bg-[#1a1a2e] px-3 py-3 text-left text-xs text-[#7070a0] transition hover:border-[#6060a0] hover:text-[#e8e8f0]"
                >
                  {page.content ? (
                    <span className="line-clamp-2">{page.content}</span>
                  ) : (
                    <span className="text-[#555570]">Click to edit markdown...</span>
                  )}
                </button>
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

      {/* Content editor popup */}
      {contentEditorId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="flex h-[80vh] w-full max-w-4xl flex-col rounded-lg border border-[#2a2a3a] bg-[#0e0e16]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#2a2a3a] px-5 py-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[#e8e8f0]">Edit Content</span>
                <span className="text-xs text-[#555570]">Markdown</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreview(!preview)}
                  className={`rounded px-3 py-1 text-xs transition ${
                    preview
                      ? "bg-[#6060a0] text-white"
                      : "bg-[#1a1a2e] text-[#7070a0] hover:text-[#e8e8f0]"
                  }`}
                >
                  {preview ? "Edit" : "Preview"}
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 gap-0 overflow-hidden">
              {preview ? (
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  {editedContent.trim() ? (
                    <MarkdownContent content={editedContent} />
                  ) : (
                    <p className="text-xs text-[#555570]">Nothing to preview</p>
                  )}
                </div>
              ) : (
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="h-full w-full resize-none border-0 bg-[#0a0a0f] px-5 py-4 text-sm text-[#e8e8f0] outline-none font-mono"
                  placeholder="## About Me&#10;&#10;Write markdown content here..."
                  autoFocus
                />
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-[#2a2a3a] px-5 py-3">
              <button
                type="button"
                onClick={closeContentEditor}
                className="rounded border border-[#2a2a3a] px-4 py-1.5 text-xs text-[#7070a0] transition hover:border-[#6060a0] hover:text-[#e8e8f0]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveContent}
                className="rounded bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───── Layout Editor ───── */

const SECTION_TYPES: { key: string; label: string }[] = [
  { key: "hero", label: "Hero" },
  { key: "reviews", label: "Reviews" },
  { key: "skills", label: "Skills" },
  { key: "experience", label: "Experience" },
  { key: "projects", label: "Projects" },
  { key: "contact", label: "Contact" },
  { key: "footer", label: "Footer" },
  { key: "custom", label: "Custom (Markdown)" },
];

const KNOWN_COMPONENTS = SECTION_TYPES.filter((t) => t.key !== "custom").map((t) => t.key);

function LayoutEditor({
  layout,
  onUpdate,
  content,
  onSectionUpdate,
}: {
  layout: LayoutConfig;
  onUpdate: (l: LayoutConfig) => void;
  content?: SiteContent;
  onSectionUpdate?: (section: string, data: any) => void;
}) {
  const [editingLabel, setEditingLabel] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editSection, setEditSection] = useState<string | null>(null);
  const [markdownContent, setMarkdownContent] = useState("");
  const [preview, setPreview] = useState(false);

  const editingSection = editSection ? layout.sections.find((s) => s.key === editSection) : null;
  const isCustom = editingSection ? !KNOWN_COMPONENTS.includes(editingSection.key) : false;
  const Editor = editingSection && !isCustom ? EDITOR_MAP[editingSection.key] : null;
  const editorData = editingSection && content && !isCustom
    ? getSectionData(editingSection.key, content)
    : null;

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

  function deleteSection(index: number) {
    const section = layout.sections[index];
    if (!window.confirm(`Remove "${section.label}" from layout?`)) return;
    const next = layout.sections.filter((_, i) => i !== index);
    onUpdate({ ...layout, sections: next });
  }

  const [showAddMenu, setShowAddMenu] = useState(false);

  function addSection(type: string) {
    setShowAddMenu(false);
    if (type === "custom") {
      const base = "custom";
      let i = 1;
      while (layout.sections.some((s) => s.key === `${base}-${i}`)) i++;
      const key = `${base}-${i}`;
      onUpdate({
        ...layout,
        sections: [...layout.sections, { key, label: `Custom ${i}`, visible: true }],
      });
    } else {
      const info = SECTION_TYPES.find((t) => t.key === type);
      if (!info) return;
      if (layout.sections.some((s) => s.key === type)) {
        alert(`"${info.label}" section already exists in the layout.`);
        return;
      }
      onUpdate({
        ...layout,
        sections: [...layout.sections, { key: info.key, label: info.label, visible: true }],
      });
    }
  }

  function startEditLabel(key: string, label: string) {
    setEditingLabel(key);
    setEditValue(label);
  }

  function saveLabel(key: string) {
    const next = layout.sections.map((s) =>
      s.key === key ? { ...s, label: editValue || s.label } : s
    );
    onUpdate({ ...layout, sections: next });
    setEditingLabel(null);
  }

  function openEditor(key: string) {
    const section = layout.sections.find((s) => s.key === key);
    if (!section) return;
    if (!KNOWN_COMPONENTS.includes(key)) {
      setMarkdownContent(section.content || "");
    }
    setEditSection(key);
    setPreview(false);
  }

  function saveEditor() {
    if (!editSection) return;
    if (isCustom) {
      const next = layout.sections.map((s) =>
        s.key === editSection ? { ...s, content: markdownContent } : s
      );
      onUpdate({ ...layout, sections: next });
    }
    setEditSection(null);
    setMarkdownContent("");
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] uppercase tracking-wider text-[#555570] mb-1">
        Manage sections — reorder, toggle, add, remove, or edit content
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
            title="Move up"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            onClick={() => moveSection(i, 1)}
            disabled={i === layout.sections.length - 1}
            className="text-[#555570] hover:text-[#e8e8f0] disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move down"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            onClick={() => toggleVisibility(i)}
            className={`text-xs font-medium ${section.visible ? "text-emerald-400" : "text-[#555570]"}`}
            title={section.visible ? "Click to hide" : "Click to show"}
          >
            {section.visible ? "ON" : "OFF"}
          </button>
          {editingLabel === section.key ? (
            <input
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => saveLabel(section.key)}
              onKeyDown={(e) => { if (e.key === "Enter") saveLabel(section.key); if (e.key === "Escape") setEditingLabel(null); }}
              className="flex-1 rounded border border-[#6060a0] bg-[#1a1a2e] px-2 py-0.5 text-sm text-[#e8e8f0] outline-none"
            />
          ) : (
            <button
              onClick={() => startEditLabel(section.key, section.label)}
              className={`flex-1 text-left text-sm ${
                section.visible ? "text-[#e8e8f0]" : "text-[#555570] line-through"
              } ${KNOWN_COMPONENTS.includes(section.key) ? "" : "italic"}`}
              title="Click to rename"
            >
              {section.label}
              {KNOWN_COMPONENTS.includes(section.key) ? (
                <span className="ml-2 text-[10px] text-[#555570]">({section.key})</span>
              ) : (
                <span className="ml-2 text-[10px] text-[#555570]">custom</span>
              )}
            </button>
          )}
          <button
            onClick={() => openEditor(section.key)}
            className="text-[10px] uppercase tracking-wider transition shrink-0 text-[#6060a0] hover:text-[#e8e8f0]"
            title="Edit content"
          >
            Edit
          </button>
          <button
            onClick={() => deleteSection(i)}
            className="text-[#555570] hover:text-red-400 transition shrink-0"
            title="Remove section"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <div className="relative mt-1">
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="text-xs text-[#7070a0] hover:text-[#e8e8f0]"
        >
          + Add section
        </button>
        {showAddMenu && (
          <div className="absolute top-full left-0 z-20 mt-1 flex flex-col rounded-lg border border-[#2a2a3a] bg-[#0e0e16] py-1 shadow-lg min-w-40">
            {SECTION_TYPES.map((type) => (
              <button
                key={type.key}
                onClick={() => addSection(type.key)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#7070a0] transition hover:bg-[#1a1a2e] hover:text-[#e8e8f0] text-left"
              >
                {type.key === "custom" ? (
                  <span className="text-[10px] text-[#555570]">#</span>
                ) : (
                  <span className="h-2 w-2 rounded-full bg-[#6060a0]" />
                )}
                {type.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Section editor popup */}
      {editSection && editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="flex h-[80vh] w-full max-w-4xl flex-col rounded-lg border border-[#2a2a3a] bg-[#0e0e16]">
            <div className="flex items-center justify-between border-b border-[#2a2a3a] px-5 py-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[#e8e8f0]">{editingSection.label}</span>
                <span className="text-xs text-[#555570]">{isCustom ? "Markdown" : editingSection.key}</span>
              </div>
              {isCustom && (
                <button
                  type="button"
                  onClick={() => setPreview(!preview)}
                  className={`rounded px-3 py-1 text-xs transition ${
                    preview ? "bg-[#6060a0] text-white" : "bg-[#1a1a2e] text-[#7070a0] hover:text-[#e8e8f0]"
                  }`}
                >
                  {preview ? "Edit" : "Preview"}
                </button>
              )}
            </div>
            <div className="flex flex-1 gap-0 overflow-hidden">
              {isCustom ? (
                preview ? (
                  <div className="flex-1 overflow-y-auto px-5 py-4">
                    {markdownContent.trim() ? (
                      <MarkdownContent content={markdownContent} />
                    ) : (
                      <p className="text-xs text-[#555570]">Nothing to preview</p>
                    )}
                  </div>
                ) : (
                  <textarea
                    value={markdownContent}
                    onChange={(e) => setMarkdownContent(e.target.value)}
                    className="h-full w-full resize-none border-0 bg-[#0a0a0f] px-5 py-4 text-sm text-[#e8e8f0] outline-none font-mono"
                    placeholder="## Section Title&#10;&#10;Write markdown content here..."
                    autoFocus
                  />
                )
              ) : Editor && editorData !== null ? (
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <Editor
                    {...(Editor === HeroEditor ? { hero: editorData, onUpdate: (data: any) => onSectionUpdate?.("hero", data) } : {})}
                    {...(Editor === SkillsEditor ? { skills: editorData, onUpdate: (data: any) => onSectionUpdate?.("skills", data) } : {})}
                    {...(Editor === ExperienceEditor ? { experience: editorData, onUpdate: (data: any) => onSectionUpdate?.("experience", data) } : {})}
                    {...(Editor === ProjectsEditor ? { projects: editorData, onUpdate: (data: any) => onSectionUpdate?.("projects", data) } : {})}
                    {...(Editor === ReviewsEditor ? { reviews: editorData, onUpdate: (data: any) => onSectionUpdate?.("reviews", data) } : {})}
                    {...(Editor === FooterEditor ? { footer: editorData, onUpdate: (data: any) => onSectionUpdate?.("footer", data) } : {})}
                  />
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-xs text-[#555570]">Editor not available</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-[#2a2a3a] px-5 py-3">
              <button
                type="button"
                onClick={() => { setEditSection(null); setMarkdownContent(""); }}
                className="rounded border border-[#2a2a3a] px-4 py-1.5 text-xs text-[#7070a0] transition hover:border-[#6060a0] hover:text-[#e8e8f0]"
              >
                {isCustom ? "Cancel" : "Close"}
              </button>
              {isCustom && (
                <button
                  type="button"
                  onClick={saveEditor}
                  className="rounded bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-500"
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
