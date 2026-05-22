import { getSupabase } from "./supabase";

export type SkillCategory = {
  category: string;
  items: string[];
};

export type ExperienceItem = {
  label: string;
  url?: string;
  github?: string;
  detail: string;
};

export type Experience = {
  role: string;
  period: string;
  description: string;
  items: ExperienceItem[];
};

export type ProjectItem = {
  label: string;
  detail: string;
};

export type Project = {
  title: string;
  period: string;
  items: ProjectItem[];
};

export type Hero = {
  subtitle: string;
  description: string;
  tags: string[];
};

export type Social = {
  github: string;
  linkedin: string;
  x: string;
};

export type Email = {
  to: string;
  subject: string;
  body: string;
};

export type Footer = {
  text: string;
};

export type SiteContent = {
  skills: SkillCategory[];
  experience: Experience;
  project: Project;
  hero: Hero;
  social: Social;
  email: Email;
  footer: Footer;
};

export async function getAllContent(): Promise<SiteContent> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("content")
      .select("section, data")
      .order("section");

    if (error) {
      console.error("Error fetching content:", error);
      return getDefaultContent();
    }

    const map: Record<string, any> = {};
    for (const row of data || []) {
      map[row.section] = row.data;
    }

    return {
      skills: (map.skills?.items as SkillCategory[]) || getDefaultContent().skills,
      experience: (map.experience as Experience) || getDefaultContent().experience,
      project: (map.project as Project) || getDefaultContent().project,
      hero: (map.hero as Hero) || getDefaultContent().hero,
      social: (map.social as Social) || getDefaultContent().social,
      email: (map.email as Email) || getDefaultContent().email,
      footer: (map.footer as Footer) || getDefaultContent().footer,
    };
  } catch {
    return getDefaultContent();
  }
}

export async function updateContent(
  section: string,
  data: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("content")
      .upsert({ section, data, updated_at: new Date().toISOString() }, { onConflict: "section" });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export function getDefaultContent(): SiteContent {
  return {
    skills: [
      { category: "Languages", items: ["JavaScript", "Python", "HTML", "CSS"] },
      { category: "Frontend", items: ["React.js", "Next.js", "Tailwind CSS"] },
      { category: "Backend", items: ["Node.js", "Express.js"] },
      { category: "Databases", items: ["MongoDB", "PostgreSQL"] },
    ],
    experience: {
      role: "Independent Software Developer",
      period: "2024 – Present",
      description:
        "Projects shipped independently, demonstrating full ownership and public deployment.",
      items: [
        {
          label: "Real-Time Internet Speed Monitor",
          url: "https://chromewebstore.google.com/detail/real-time-internet-speed/baffnjfijbgpjchgdmbnpkloeccnhenl",
          github: "https://github.com/aajinn/real-time-internet-speed",
          detail:
            "Chrome Extension — Engineered and published a performant tool now at 1,000+ active installs.",
        },
        {
          label: "MongooseNet NuGet Package",
          url: "https://www.nuget.org/packages/MongooseNet/",
          github: "https://github.com/aajinn/MongooseNet",
          detail:
            "Authored and published a reusable C# library for schema‑flexible data handling in MongoDB.",
        },
      ],
    },
    project: {
      title: "TaskFlow – Full-Stack Project Management App",
      period: "2026",
      items: [
        {
          label: "Scalable Architecture",
          detail:
            "Next.js (React) frontend and Express.js Node.js backend, using modular service-based backend architecture.",
        },
        {
          label: "Real-Time Collaboration",
          detail:
            "WebSockets eliminating manual page refreshes for collaborative teams.",
        },
        {
          label: "Auth & Access Control",
          detail:
            "JWT authentication and role‑based access (Admin/Member) to secure multi‑user workspaces.",
        },
        {
          label: "Polished UI/UX",
          detail:
            "Mobile‑first, responsive design with Tailwind CSS, skeleton loaders, and optimistic UI updates.",
        },
      ],
    },
    hero: {
      subtitle: "Full Stack Product Builder",
      description:
        "Building scalable web products focused on automation, real-time systems, and AI integrations.",
      tags: [
        "REST APIs",
        "Auth & JWT",
        "Rate Limiting",
        "Payment Integration",
        "Real-time Systems",
        "Database Design",
        "CI/CD",
        "Chrome Extensions",
        "AI Integration",
        "Async Programming",
        "Web Performance",
        "Automation",
      ],
    },
    social: {
      github: "https://github.com/aajinn",
      linkedin: "https://www.linkedin.com/in/ajin-varghese-chandy-1654a4276",
      x: "https://x.com/areddev",
    },
    email: {
      to: "careerajin@gmail.com",
      subject: "Opportunity%20for%20Ajin%20Varghese%20Chandy",
      body: "Hi%20Ajin%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20I%20am%20interested%20in%20discussing%20a%20potential%20opportunity%20with%20you.%0A%0ARole%3A%20%5BJob%20Title%5D%0ACompany%3A%20%5BCompany%20Name%5D%0ALocation%3A%20%5BRemote%20%2F%20On-site%20%2F%20Hybrid%5D%0A%0AHere%20is%20a%20brief%20overview%20of%20what%20we%20are%20looking%20for%3A%0A%5BDescribe%20the%20role%20and%20requirements%5D%0A%0ALooking%20forward%20to%20hearing%20from%20you.%0A%0ABest%20regards%2C%0A%5BYour%20Name%5D%0A%5BYour%20Company%5D%0A%5BYour%20Contact%5D",
    },
    footer: {
      text: "Ajin Varghese Chandy · Full Stack Product Builder",
    },
  };
}
