"use client";

import { useEffect, useState, useCallback } from "react";
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
} from "@/lib/content";
import { getDefaultContent } from "@/lib/content";

const SECTIONS = [
  { key: "hero", label: "Hero" },
  { key: "skills", label: "Skills" },
  { key: "experience", label: "Experience" },
  { key: "projects", label: "Projects" },
  { key: "social", label: "Social Links" },
  { key: "email", label: "Contact Email" },
  { key: "footer", label: "Footer" },
  { key: "reviews", label: "Reviews" },
] as const;

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

export default function AdminPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirtySections, setDirtySections] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);

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
      const data = getSectionData(section, content);
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
        setSaving(false);
        return;
      }
    }

    setDirtySections(new Set());
    setStatus({ type: "success", text: "All changes saved" });
    setSaving(false);
  }

  function handleLogin(key: string) {
    sessionStorage.setItem("admin_key", key);
    setAdminKey(key);
  }

  if (!adminKey) return <AdminLogin onLogin={handleLogin} />;
  if (!content) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#0a0a0f]">
        <p className="text-sm text-[#7070a0]">Loading...</p>
      </div>
    );
  }

  const dirtyCount = dirtySections.size;

  return (
    <div className="flex min-h-svh bg-[#0a0a0f]">
      {/* Sidebar */}
      <nav className="hidden w-48 shrink-0 border-r border-[#1e1e2e] bg-[#0e0e16] p-4 sm:block">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-sm font-semibold text-[#e8e8f0]">Admin</h1>
          <button
            onClick={() => { sessionStorage.removeItem("admin_key"); setAdminKey(null); }}
            className="text-[10px] uppercase tracking-wider text-[#555570] hover:text-[#e8e8f0]"
          >
            Logout
          </button>
        </div>
        <div className="flex flex-col gap-1">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setOpenSection(openSection === s.key ? null : s.key)}
              className={`flex items-center gap-2 rounded px-3 py-2 text-left text-xs transition ${
                openSection === s.key
                  ? "bg-[#1a1a2e] text-[#e8e8f0]"
                  : "text-[#7070a0] hover:text-[#a0a0c0]"
              }`}
            >
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dirtySections.has(s.key) ? "bg-amber-400" : "bg-transparent"}`} />
              {s.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-[#e8e8f0] sm:hidden">Admin Panel</h1>
            {dirtyCount > 0 ? (
              <p className="mt-0.5 text-xs text-amber-400">{dirtyCount} unsaved section{dirtyCount > 1 ? "s" : ""}</p>
            ) : (
              <p className="mt-0.5 text-xs text-[#555570]">All changes saved</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {status && (
              <span className={`text-xs ${status.type === "success" ? "text-emerald-400" : "text-red-400"}`}>
                {status.text}
              </span>
            )}
            {dirtyCount > 0 && (
              <button
                onClick={saveAll}
                disabled={saving}
                className="rounded bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50"
              >
                {saving ? "Saving..." : `Save All (${dirtyCount})`}
              </button>
            )}
            <button
              onClick={() => { sessionStorage.removeItem("admin_key"); setAdminKey(null); }}
              className="rounded border border-[#2a2a3a] px-3 py-1.5 text-xs text-[#7070a0] transition hover:border-[#6060a0] hover:text-[#e8e8f0] sm:hidden"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Sections */}
        <div className="mx-auto max-w-2xl">
          <CollapsibleSection
            label="Hero"
            section="hero"
            isOpen={openSection === "hero"}
            onToggle={() => setOpenSection(openSection === "hero" ? null : "hero")}
            dirty={dirtySections.has("hero")}
          >
            <HeroEditor
              hero={content.hero}
              onUpdate={(data) => { setContent((p) => p ? { ...p, hero: data } : p); markDirty("hero"); }}
            />
          </CollapsibleSection>

          <CollapsibleSection
            label="Skills"
            section="skills"
            isOpen={openSection === "skills"}
            onToggle={() => setOpenSection(openSection === "skills" ? null : "skills")}
            dirty={dirtySections.has("skills")}
          >
            <SkillsEditor
              skills={content.skills}
              onUpdate={(data) => { setContent((p) => p ? { ...p, skills: data } : p); markDirty("skills"); }}
            />
          </CollapsibleSection>

          <CollapsibleSection
            label="Experience"
            section="experience"
            isOpen={openSection === "experience"}
            onToggle={() => setOpenSection(openSection === "experience" ? null : "experience")}
            dirty={dirtySections.has("experience")}
          >
            <ExperienceEditor
              experience={content.experience}
              onUpdate={(data) => { setContent((p) => p ? { ...p, experience: data } : p); markDirty("experience"); }}
            />
          </CollapsibleSection>

          <CollapsibleSection
            label="Projects"
            section="projects"
            isOpen={openSection === "projects"}
            onToggle={() => setOpenSection(openSection === "projects" ? null : "projects")}
            dirty={dirtySections.has("projects")}
          >
            <ProjectsEditor
              projects={content.projects}
              onUpdate={(data) => { setContent((p) => p ? { ...p, projects: data } : p); markDirty("projects"); }}
            />
          </CollapsibleSection>

          <CollapsibleSection
            label="Social Links"
            section="social"
            isOpen={openSection === "social"}
            onToggle={() => setOpenSection(openSection === "social" ? null : "social")}
            dirty={dirtySections.has("social")}
          >
            <SocialEditor
              social={content.social}
              onUpdate={(data) => { setContent((p) => p ? { ...p, social: data } : p); markDirty("social"); }}
            />
          </CollapsibleSection>

          <CollapsibleSection
            label="Contact Email"
            section="email"
            isOpen={openSection === "email"}
            onToggle={() => setOpenSection(openSection === "email" ? null : "email")}
            dirty={dirtySections.has("email")}
          >
            <EmailEditor
              email={content.email}
              onUpdate={(data) => { setContent((p) => p ? { ...p, email: data } : p); markDirty("email"); }}
            />
          </CollapsibleSection>

          <CollapsibleSection
            label="Footer"
            section="footer"
            isOpen={openSection === "footer"}
            onToggle={() => setOpenSection(openSection === "footer" ? null : "footer")}
            dirty={dirtySections.has("footer")}
          >
            <FooterEditor
              footer={content.footer}
              onUpdate={(data) => { setContent((p) => p ? { ...p, footer: data } : p); markDirty("footer"); }}
            />
          </CollapsibleSection>

          <CollapsibleSection
            label="Reviews"
            section="reviews"
            isOpen={openSection === "reviews"}
            onToggle={() => setOpenSection(openSection === "reviews" ? null : "reviews")}
            dirty={dirtySections.has("reviews")}
          >
            <ReviewsEditor
              reviews={content.reviews}
              onUpdate={(data) => { setContent((p) => p ? { ...p, reviews: data } : p); markDirty("reviews"); }}
            />
          </CollapsibleSection>
        </div>
      </main>
    </div>
  );
}

function getSectionData(section: string, content: SiteContent): Record<string, any> {
  switch (section) {
    case "skills": return { items: content.skills };
    case "projects": return { items: content.projects };
    case "reviews": return { items: content.reviews };
    case "hero": return content.hero;
    case "experience": return content.experience;
    case "social": return content.social;
    case "email": return content.email;
    case "footer": return content.footer;
    default: return {};
  }
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

/* ───── Section Editors ───── */

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
