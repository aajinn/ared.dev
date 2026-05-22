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

          <ProjectsEditor
            projects={content.projects}
            onUpdate={(data) => {
              setContent((prev) => prev ? { ...prev, projects: data } : prev);
              markDirty("projects");
            }}
            dirty={dirtySections.has("projects")}
            onSave={() => saveSection("projects", { items: content.projects })}
            saving={saving === "projects"}
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

          <EmailEditor
            email={content.email}
            onUpdate={(data) => {
              setContent((prev) => prev ? { ...prev, email: data } : prev);
              markDirty("email");
            }}
            dirty={dirtySections.has("email")}
            onSave={() => saveSection("email", content.email)}
            saving={saving === "email"}
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

          <ReviewsEditor
            reviews={content.reviews}
            onUpdate={(data) => {
              setContent((prev) => prev ? { ...prev, reviews: data } : prev);
              markDirty("reviews");
            }}
            dirty={dirtySections.has("reviews")}
            onSave={() => saveSection("reviews", { items: content.reviews })}
            saving={saving === "reviews"}
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

function ProjectsEditor({
  projects,
  onUpdate,
  dirty,
  onSave,
  saving,
}: {
  projects: Project[];
  onUpdate: (projects: Project[]) => void;
} & Pick<SectionEditorProps, "dirty" | "onSave" | "saving">) {
  function updateProject(index: number, field: string, value: string) {
    const next = projects.map((p, i) =>
      i === index ? { ...p, [field]: value } : p
    );
    onUpdate(next);
  }

  function updateProjectItem(
    projIndex: number,
    itemIndex: number,
    field: string,
    value: string
  ) {
    const next = projects.map((p, i) => {
      if (i !== projIndex) return p;
      return {
        ...p,
        items: p.items.map((item, j) =>
          j === itemIndex ? { ...item, [field]: value } : item
        ),
      };
    });
    onUpdate(next);
  }

  function addProjectItem(projIndex: number) {
    const next = projects.map((p, i) =>
      i === projIndex
        ? { ...p, items: [...p.items, { label: "", detail: "" }] }
        : p
    );
    onUpdate(next);
  }

  function removeProjectItem(projIndex: number, itemIndex: number) {
    const next = projects.map((p, i) =>
      i === projIndex
        ? { ...p, items: p.items.filter((_, j) => j !== itemIndex) }
        : p
    );
    onUpdate(next);
  }

  function addProject() {
    onUpdate([
      ...projects,
      { title: "", period: "", items: [{ label: "", detail: "" }] },
    ]);
  }

  function removeProject(index: number) {
    onUpdate(projects.filter((_, i) => i !== index));
  }

  return (
    <SectionEditor
      label="Projects"
      section="projects"
      dirty={dirty}
      onSave={onSave}
      saving={saving}
    >
      <div className="flex flex-col gap-4">
        {projects.map((project, pi) => (
          <div
            key={pi}
            className="rounded-lg border border-[#2a2a3a] bg-[#1a1a2e] p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-[#555570]">
                Project {pi + 1}
              </span>
              <button
                onClick={() => removeProject(pi)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Remove project
              </button>
            </div>
            <div className="mb-3 grid grid-cols-2 gap-3">
              <input
                className="rounded border border-[#2a2a3a] bg-[#0a0a0f] px-2 py-1 text-sm text-[#e8e8f0] outline-none focus:border-[#6060a0]"
                value={project.title}
                onChange={(e) => updateProject(pi, "title", e.target.value)}
                placeholder="Title"
              />
              <input
                className="rounded border border-[#2a2a3a] bg-[#0a0a0f] px-2 py-1 text-sm text-[#e8e8f0] outline-none focus:border-[#6060a0]"
                value={project.period}
                onChange={(e) => updateProject(pi, "period", e.target.value)}
                placeholder="Period"
              />
            </div>
            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-wider text-[#555570]">
                Items
              </label>
              <div className="flex flex-col gap-2">
                {project.items.map((item, ii) => (
                  <div
                    key={ii}
                    className="rounded border border-[#2a2a3a] bg-[#0a0a0f] p-2"
                  >
                    <div className="mb-2 flex gap-2">
                      <input
                        className="flex-1 rounded border border-[#2a2a3a] bg-[#1a1a2e] px-2 py-1 text-xs text-[#e8e8f0] outline-none focus:border-[#6060a0]"
                        value={item.label}
                        onChange={(e) =>
                          updateProjectItem(pi, ii, "label", e.target.value)
                        }
                        placeholder="Label"
                      />
                      <button
                        onClick={() => removeProjectItem(pi, ii)}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                    <textarea
                      className="w-full rounded border border-[#2a2a3a] bg-[#1a1a2e] px-2 py-1 text-xs text-[#e8e8f0] outline-none focus:border-[#6060a0]"
                      rows={2}
                      value={item.detail}
                      onChange={(e) =>
                        updateProjectItem(pi, ii, "detail", e.target.value)
                      }
                      placeholder="Detail"
                    />
                  </div>
                ))}
                <button
                  onClick={() => addProjectItem(pi)}
                  className="self-start rounded border border-dashed border-[#2a2a3a] px-3 py-1 text-xs text-[#7070a0] transition hover:border-[#6060a0] hover:text-[#a0a0c0]"
                >
                  + Add item
                </button>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={addProject}
          className="self-start rounded border border-dashed border-[#2a2a3a] px-4 py-2 text-sm text-[#7070a0] transition hover:border-[#6060a0] hover:text-[#a0a0c0]"
        >
          + Add project
        </button>
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

function EmailEditor({
  email,
  onUpdate,
  dirty,
  onSave,
  saving,
}: {
  email: Email;
  onUpdate: (e: Email) => void;
} & Pick<SectionEditorProps, "dirty" | "onSave" | "saving">) {
  return (
    <SectionEditor
      label="Contact Email"
      section="email"
      dirty={dirty}
      onSave={onSave}
      saving={saving}
    >
      <div className="flex flex-col gap-3">
        <div>
          <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#555570]">
            Recipient Email
          </label>
          <input
            className="w-full rounded border border-[#2a2a3a] bg-[#1a1a2e] px-3 py-2 text-sm text-[#e8e8f0] outline-none focus:border-[#6060a0]"
            value={email.to}
            onChange={(e) => onUpdate({ ...email, to: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#555570]">
            Subject Template
          </label>
          <input
            className="w-full rounded border border-[#2a2a3a] bg-[#1a1a2e] px-3 py-2 text-sm text-[#e8e8f0] outline-none focus:border-[#6060a0]"
            value={email.subject}
            onChange={(e) => onUpdate({ ...email, subject: e.target.value })}
          />
          <p className="mt-1 text-[10px] text-[#555570]">Use %email% as placeholder for the sender&apos;s address</p>
        </div>
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

function ReviewsEditor({
  reviews,
  onUpdate,
  dirty,
  onSave,
  saving,
}: {
  reviews: Review[];
  onUpdate: (r: Review[]) => void;
} & Pick<SectionEditorProps, "dirty" | "onSave" | "saving">) {
  function updateReview(index: number, field: string, value: string | number | boolean | undefined) {
    const next = reviews.map((r, i) =>
      i === index ? { ...r, [field]: value } : r
    );
    onUpdate(next);
  }

  function addReview() {
    onUpdate([...reviews, { author: "", rating: 5, date: "", text: "" }]);
  }

  function removeReview(index: number) {
    onUpdate(reviews.filter((_, i) => i !== index));
  }

  return (
    <SectionEditor
      label="Reviews"
      section="reviews"
      dirty={dirty}
      onSave={onSave}
      saving={saving}
    >
      <div className="flex flex-col gap-4">
        {reviews.map((review, i) => (
          <div key={i} className="rounded-lg border border-[#2a2a3a] bg-[#1a1a2e] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-[#555570]">
                Review {i + 1}
              </span>
              <button onClick={() => removeReview(i)} className="text-xs text-red-400 hover:text-red-300">
                Remove
              </button>
            </div>
            <div className="mb-3 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#555570]">Author</label>
                <input
                  className="w-full rounded border border-[#2a2a3a] bg-[#0a0a0f] px-2 py-1 text-xs text-[#e8e8f0] outline-none focus:border-[#6060a0]"
                  value={review.author}
                  onChange={(e) => updateReview(i, "author", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#555570]">Date</label>
                <input
                  className="w-full rounded border border-[#2a2a3a] bg-[#0a0a0f] px-2 py-1 text-xs text-[#e8e8f0] outline-none focus:border-[#6060a0]"
                  value={review.date}
                  onChange={(e) => updateReview(i, "date", e.target.value)}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#555570]">Text</label>
              <textarea
                className="w-full rounded border border-[#2a2a3a] bg-[#0a0a0f] px-2 py-1 text-xs text-[#e8e8f0] outline-none focus:border-[#6060a0]"
                rows={3}
                value={review.text}
                onChange={(e) => updateReview(i, "text", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#555570]">Rating (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  className="w-full rounded border border-[#2a2a3a] bg-[#0a0a0f] px-2 py-1 text-xs text-[#e8e8f0] outline-none focus:border-[#6060a0]"
                  value={review.rating}
                  onChange={(e) => updateReview(i, "rating", Number(e.target.value))}
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-[#555570]">Helpful count</label>
                <input
                  type="number"
                  min={0}
                  className="w-full rounded border border-[#2a2a3a] bg-[#0a0a0f] px-2 py-1 text-xs text-[#e8e8f0] outline-none focus:border-[#6060a0]"
                  value={review.helpful || ""}
                  onChange={(e) => updateReview(i, "helpful", e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-[#7070a0]">
                  <input
                    type="checkbox"
                    checked={review.isDeveloper || false}
                    onChange={(e) => updateReview(i, "isDeveloper", e.target.checked)}
                    className="accent-emerald-500"
                  />
                  Developer reply
                </label>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={addReview}
          className="self-start rounded border border-dashed border-[#2a2a3a] px-4 py-2 text-sm text-[#7070a0] transition hover:border-[#6060a0] hover:text-[#a0a0c0]"
        >
          + Add review
        </button>
      </div>
    </SectionEditor>
  );
}
