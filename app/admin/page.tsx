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
} from "@/lib/content";
import { getDefaultContent } from "@/lib/content";

type SectionEditorProps = {
  label: string;
  section: string;
  children: React.ReactNode;
  dirty: boolean;
  onSave: () => void;
  saving: boolean;
};

function SectionEditor({
  label,
  section,
  children,
  dirty,
  onSave,
  saving,
}: SectionEditorProps) {
  return (
    <div className="rounded-lg border border-[#2a2a3a] bg-[#0e0e16] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#e8e8f0]">{label}</h3>
        {dirty && (
          <button
            onClick={onSave}
            disabled={saving}
            className="rounded bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function AdminLogin({ onLogin }: { onLogin: (key: string) => void }) {
  const [key, setKey] = useState("");

  return (
    <div className="flex min-h-svh items-center justify-center bg-[#0a0a0f] px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onLogin(key);
        }}
        className="w-full max-w-xs rounded-lg border border-[#2a2a3a] bg-[#0e0e16] p-6"
      >
        <h1 className="mb-4 text-center text-sm font-semibold text-[#e8e8f0]">
          Admin Login
        </h1>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Admin key"
          className="mb-3 w-full rounded border border-[#2a2a3a] bg-[#1a1a2e] px-3 py-2 text-sm text-[#e8e8f0] outline-none focus:border-[#6060a0]"
        />
        <button
          type="submit"
          className="w-full rounded bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default function AdminPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [dirtySections, setDirtySections] = useState<Set<string>>(new Set());
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [adminKey, setAdminKey] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_key");
    if (stored) {
      setAdminKey(stored);
    }
  }, []);

  useEffect(() => {
    if (!adminKey) return;
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => setContent(data))
      .catch(() => {
        setContent(getDefaultContent());
        setStatusMessage({ type: "error", text: "Failed to load content" });
      });
  }, [adminKey]);

  const markDirty = useCallback((section: string) => {
    setDirtySections((prev) => new Set(prev).add(section));
  }, []);

  const saveSection = useCallback(
    async (section: string, data: any) => {
      setSaving(section);
      setStatusMessage(null);

      try {
        const res = await fetch("/api/content", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": adminKey!,
          },
          body: JSON.stringify({ section, data }),
        });

        if (!res.ok) {
          const err = await res.json();
          setStatusMessage({ type: "error", text: err.error || "Save failed" });
          return;
        }

        setDirtySections((prev) => {
          const next = new Set(prev);
          next.delete(section);
          return next;
        });
        setStatusMessage({ type: "success", text: `${section} saved` });
      } catch {
        setStatusMessage({ type: "error", text: "Network error" });
      } finally {
        setSaving(null);
      }
    },
    [adminKey]
  );

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

  return (
    <main className="min-h-svh bg-[#0a0a0f] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-[#e8e8f0]">Admin Panel</h1>
          <button
            onClick={() => {
              sessionStorage.removeItem("admin_key");
              setAdminKey(null);
            }}
            className="rounded border border-[#2a2a3a] px-3 py-1.5 text-xs text-[#7070a0] transition hover:border-[#6060a0] hover:text-[#e8e8f0]"
          >
            Logout
          </button>
        </div>

        {statusMessage && (
          <div
            className={`mb-4 rounded px-4 py-2 text-sm ${
              statusMessage.type === "success"
                ? "bg-emerald-900/50 text-emerald-300"
                : "bg-red-900/50 text-red-300"
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <HeroEditor
            hero={content.hero}
            onUpdate={(data) => {
              setContent((prev) => prev ? { ...prev, hero: data } : prev);
              markDirty("hero");
            }}
            dirty={dirtySections.has("hero")}
            onSave={() => saveSection("hero", content.hero)}
            saving={saving === "hero"}
          />

          <SkillsEditor
            skills={content.skills}
            onUpdate={(data) => {
              setContent((prev) => prev ? { ...prev, skills: data } : prev);
              markDirty("skills");
            }}
            dirty={dirtySections.has("skills")}
            onSave={() => saveSection("skills", { items: content.skills })}
            saving={saving === "skills"}
          />

          <ExperienceEditor
            experience={content.experience}
            onUpdate={(data) => {
              setContent((prev) => prev ? { ...prev, experience: data } : prev);
              markDirty("experience");
            }}
            dirty={dirtySections.has("experience")}
            onSave={() => saveSection("experience", content.experience)}
            saving={saving === "experience"}
          />

          <ProjectEditor
            project={content.project}
            onUpdate={(data) => {
              setContent((prev) => prev ? { ...prev, project: data } : prev);
              markDirty("project");
            }}
            dirty={dirtySections.has("project")}
            onSave={() => saveSection("project", content.project)}
            saving={saving === "project"}
          />

          <SocialEditor
            social={content.social}
            onUpdate={(data) => {
              setContent((prev) => prev ? { ...prev, social: data } : prev);
              markDirty("social");
            }}
            dirty={dirtySections.has("social")}
            onSave={() => saveSection("social", content.social)}
            saving={saving === "social"}
          />

          <FooterEditor
            footer={content.footer}
            onUpdate={(data) => {
              setContent((prev) => prev ? { ...prev, footer: data } : prev);
              markDirty("footer");
            }}
            dirty={dirtySections.has("footer")}
            onSave={() => saveSection("footer", content.footer)}
            saving={saving === "footer"}
          />
        </div>
      </div>
    </main>
  );
}

/* ───── Section Editors ───── */

function SkillsEditor({
  skills,
  onUpdate,
  dirty,
  onSave,
  saving,
}: {
  skills: SkillCategory[];
  onUpdate: (skills: SkillCategory[]) => void;
} & Pick<SectionEditorProps, "dirty" | "onSave" | "saving">) {
  function updateCategory(index: number, field: string, value: string) {
    const next = skills.map((cat, i) => {
      if (i !== index) return cat;
      if (field === "category") return { ...cat, category: value };
      return {
        ...cat,
        items: value.split(",").map((s) => s.trim()),
      };
    });
    onUpdate(next);
  }

  function addCategory() {
    onUpdate([...skills, { category: "", items: [] }]);
  }

  function removeCategory(index: number) {
    onUpdate(skills.filter((_, i) => i !== index));
  }

  return (
    <SectionEditor
      label="Skills"
      section="skills"
      dirty={dirty}
      onSave={onSave}
      saving={saving}
    >
      <div className="flex flex-col gap-3">
        {skills.map((cat, i) => (
          <div
            key={i}
            className="rounded border border-[#2a2a3a] bg-[#1a1a2e] p-3"
          >
            <div className="mb-2 flex items-center gap-2">
              <input
                className="flex-1 rounded border border-[#2a2a3a] bg-[#0a0a0f] px-2 py-1 text-xs text-[#e8e8f0] outline-none focus:border-[#6060a0]"
                value={cat.category}
                onChange={(e) => updateCategory(i, "category", e.target.value)}
                placeholder="Category"
              />
              <button
                onClick={() => removeCategory(i)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
            <input
              className="w-full rounded border border-[#2a2a3a] bg-[#0a0a0f] px-2 py-1 text-xs text-[#e8e8f0] outline-none focus:border-[#6060a0]"
              value={cat.items.join(", ")}
              onChange={(e) => updateCategory(i, "items", e.target.value)}
              placeholder="Comma-separated skills"
            />
          </div>
        ))}
        <button
          onClick={addCategory}
          className="self-start rounded border border-dashed border-[#2a2a3a] px-3 py-1 text-xs text-[#7070a0] transition hover:border-[#6060a0] hover:text-[#a0a0c0]"
        >
          + Add category
        </button>
      </div>
    </SectionEditor>
  );
}

function HeroEditor({
  hero,
  onUpdate,
  dirty,
  onSave,
  saving,
}: {
  hero: Hero;
  onUpdate: (hero: Hero) => void;
} & Pick<SectionEditorProps, "dirty" | "onSave" | "saving">) {
  return (
    <SectionEditor
      label="Hero"
      section="hero"
      dirty={dirty}
      onSave={onSave}
      saving={saving}
    >
      <div className="flex flex-col gap-3">
        <div>
          <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#555570]">
            Subtitle
          </label>
          <input
            className="w-full rounded border border-[#2a2a3a] bg-[#1a1a2e] px-3 py-2 text-sm text-[#e8e8f0] outline-none focus:border-[#6060a0]"
            value={hero.subtitle}
            onChange={(e) => onUpdate({ ...hero, subtitle: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#555570]">
            Description
          </label>
          <textarea
            className="w-full rounded border border-[#2a2a3a] bg-[#1a1a2e] px-3 py-2 text-sm text-[#e8e8f0] outline-none focus:border-[#6060a0]"
            rows={2}
            value={hero.description}
            onChange={(e) =>
              onUpdate({ ...hero, description: e.target.value })
            }
          />
        </div>
        <div>
          <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#555570]">
            Tags (comma-separated)
          </label>
          <input
            className="w-full rounded border border-[#2a2a3a] bg-[#1a1a2e] px-3 py-2 text-sm text-[#e8e8f0] outline-none focus:border-[#6060a0]"
            value={hero.tags.join(", ")}
            onChange={(e) =>
              onUpdate({
                ...hero,
                tags: e.target.value.split(",").map((s) => s.trim()),
              })
            }
          />
        </div>
      </div>
    </SectionEditor>
  );
}

function ExperienceEditor({
  experience,
  onUpdate,
  dirty,
  onSave,
  saving,
}: {
  experience: Experience;
  onUpdate: (exp: Experience) => void;
} & Pick<SectionEditorProps, "dirty" | "onSave" | "saving">) {
  function updateItem(index: number, field: string, value: string) {
    const items = experience.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onUpdate({ ...experience, items });
  }

  function addItem() {
    onUpdate({
      ...experience,
      items: [...experience.items, { label: "", detail: "" }],
    });
  }

  function removeItem(index: number) {
    onUpdate({
      ...experience,
      items: experience.items.filter((_, i) => i !== index),
    });
  }

  return (
    <SectionEditor
      label="Technical Experience"
      section="experience"
      dirty={dirty}
      onSave={onSave}
      saving={saving}
    >
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#555570]">
              Role
            </label>
            <input
              className="w-full rounded border border-[#2a2a3a] bg-[#1a1a2e] px-3 py-2 text-sm text-[#e8e8f0] outline-none focus:border-[#6060a0]"
              value={experience.role}
              onChange={(e) =>
                onUpdate({ ...experience, role: e.target.value })
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#555570]">
              Period
            </label>
            <input
              className="w-full rounded border border-[#2a2a3a] bg-[#1a1a2e] px-3 py-2 text-sm text-[#e8e8f0] outline-none focus:border-[#6060a0]"
              value={experience.period}
              onChange={(e) =>
                onUpdate({ ...experience, period: e.target.value })
              }
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#555570]">
            Description
          </label>
          <textarea
            className="w-full rounded border border-[#2a2a3a] bg-[#1a1a2e] px-3 py-2 text-sm text-[#e8e8f0] outline-none focus:border-[#6060a0]"
            rows={2}
            value={experience.description}
            onChange={(e) =>
              onUpdate({ ...experience, description: e.target.value })
            }
          />
        </div>
        <div>
          <label className="mb-2 block text-[10px] uppercase tracking-wider text-[#555570]">
            Items
          </label>
          <div className="flex flex-col gap-2">
            {experience.items.map((item, i) => (
              <div
                key={i}
                className="rounded border border-[#2a2a3a] bg-[#1a1a2e] p-3"
              >
                <div className="mb-2 flex gap-2">
                  <input
                    className="flex-1 rounded border border-[#2a2a3a] bg-[#0a0a0f] px-2 py-1 text-xs text-[#e8e8f0] outline-none focus:border-[#6060a0]"
                    value={item.label}
                    onChange={(e) => updateItem(i, "label", e.target.value)}
                    placeholder="Label"
                  />
                  <input
                    className="flex-[2] rounded border border-[#2a2a3a] bg-[#0a0a0f] px-2 py-1 text-xs text-[#e8e8f0] outline-none focus:border-[#6060a0]"
                    value={item.url || ""}
                    onChange={(e) => updateItem(i, "url", e.target.value)}
                    placeholder="URL (optional)"
                  />
                  <input
                    className="flex-[2] rounded border border-[#2a2a3a] bg-[#0a0a0f] px-2 py-1 text-xs text-[#e8e8f0] outline-none focus:border-[#6060a0]"
                    value={item.github || ""}
                    onChange={(e) => updateItem(i, "github", e.target.value)}
                    placeholder="GitHub (optional)"
                  />
                  <button
                    onClick={() => removeItem(i)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
                <textarea
                  className="w-full rounded border border-[#2a2a3a] bg-[#0a0a0f] px-2 py-1 text-xs text-[#e8e8f0] outline-none focus:border-[#6060a0]"
                  rows={2}
                  value={item.detail}
                  onChange={(e) => updateItem(i, "detail", e.target.value)}
                  placeholder="Detail"
                />
              </div>
            ))}
            <button
              onClick={addItem}
              className="self-start rounded border border-dashed border-[#2a2a3a] px-3 py-1 text-xs text-[#7070a0] transition hover:border-[#6060a0] hover:text-[#a0a0c0]"
            >
              + Add item
            </button>
          </div>
        </div>
      </div>
    </SectionEditor>
  );
}

function ProjectEditor({
  project,
  onUpdate,
  dirty,
  onSave,
  saving,
}: {
  project: Project;
  onUpdate: (proj: Project) => void;
} & Pick<SectionEditorProps, "dirty" | "onSave" | "saving">) {
  function updateItem(index: number, field: string, value: string) {
    const items = project.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onUpdate({ ...project, items });
  }

  function addItem() {
    onUpdate({
      ...project,
      items: [...project.items, { label: "", detail: "" }],
    });
  }

  function removeItem(index: number) {
    onUpdate({
      ...project,
      items: project.items.filter((_, i) => i !== index),
    });
  }

  return (
    <SectionEditor
      label="Project"
      section="project"
      dirty={dirty}
      onSave={onSave}
      saving={saving}
    >
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#555570]">
              Title
            </label>
            <input
              className="w-full rounded border border-[#2a2a3a] bg-[#1a1a2e] px-3 py-2 text-sm text-[#e8e8f0] outline-none focus:border-[#6060a0]"
              value={project.title}
              onChange={(e) =>
                onUpdate({ ...project, title: e.target.value })
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#555570]">
              Period
            </label>
            <input
              className="w-full rounded border border-[#2a2a3a] bg-[#1a1a2e] px-3 py-2 text-sm text-[#e8e8f0] outline-none focus:border-[#6060a0]"
              value={project.period}
              onChange={(e) =>
                onUpdate({ ...project, period: e.target.value })
              }
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-[10px] uppercase tracking-wider text-[#555570]">
            Items
          </label>
          <div className="flex flex-col gap-2">
            {project.items.map((item, i) => (
              <div
                key={i}
                className="rounded border border-[#2a2a3a] bg-[#1a1a2e] p-3"
              >
                <div className="mb-2 flex gap-2">
                  <input
                    className="flex-1 rounded border border-[#2a2a3a] bg-[#0a0a0f] px-2 py-1 text-xs text-[#e8e8f0] outline-none focus:border-[#6060a0]"
                    value={item.label}
                    onChange={(e) => updateItem(i, "label", e.target.value)}
                    placeholder="Label"
                  />
                  <button
                    onClick={() => removeItem(i)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
                <textarea
                  className="w-full rounded border border-[#2a2a3a] bg-[#0a0a0f] px-2 py-1 text-xs text-[#e8e8f0] outline-none focus:border-[#6060a0]"
                  rows={2}
                  value={item.detail}
                  onChange={(e) => updateItem(i, "detail", e.target.value)}
                  placeholder="Detail"
                />
              </div>
            ))}
            <button
              onClick={addItem}
              className="self-start rounded border border-dashed border-[#2a2a3a] px-3 py-1 text-xs text-[#7070a0] transition hover:border-[#6060a0] hover:text-[#a0a0c0]"
            >
              + Add item
            </button>
          </div>
        </div>
      </div>
    </SectionEditor>
  );
}

function SocialEditor({
  social,
  onUpdate,
  dirty,
  onSave,
  saving,
}: {
  social: Social;
  onUpdate: (s: Social) => void;
} & Pick<SectionEditorProps, "dirty" | "onSave" | "saving">) {
  return (
    <SectionEditor
      label="Social Links"
      section="social"
      dirty={dirty}
      onSave={onSave}
      saving={saving}
    >
      <div className="flex flex-col gap-3">
        {(["github", "linkedin", "x"] as const).map((platform) => (
          <div key={platform}>
            <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#555570]">
              {platform}
            </label>
            <input
              className="w-full rounded border border-[#2a2a3a] bg-[#1a1a2e] px-3 py-2 text-sm text-[#e8e8f0] outline-none focus:border-[#6060a0]"
              value={social[platform]}
              onChange={(e) =>
                onUpdate({ ...social, [platform]: e.target.value })
              }
            />
          </div>
        ))}
      </div>
    </SectionEditor>
  );
}

function FooterEditor({
  footer,
  onUpdate,
  dirty,
  onSave,
  saving,
}: {
  footer: Footer;
  onUpdate: (f: Footer) => void;
} & Pick<SectionEditorProps, "dirty" | "onSave" | "saving">) {
  return (
    <SectionEditor
      label="Footer"
      section="footer"
      dirty={dirty}
      onSave={onSave}
      saving={saving}
    >
      <input
        className="w-full rounded border border-[#2a2a3a] bg-[#1a1a2e] px-3 py-2 text-sm text-[#e8e8f0] outline-none focus:border-[#6060a0]"
        value={footer.text}
        onChange={(e) => onUpdate({ ...footer, text: e.target.value })}
      />
    </SectionEditor>
  );
}
