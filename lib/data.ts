import { cacheLife, cacheTag } from "next/cache";
import { getPublicClient, getAdminClient } from "./supabase";
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
} from "./content";
import { getDefaultContent } from "./content";

export async function getAllContent(): Promise<SiteContent> {
  "use cache";
  cacheLife("hours");
  cacheTag("content");

  try {
    const supabase = getPublicClient();
    const result = await supabase
      .from("content")
      .select("section, data")
      .order("section");
    const data = result.data as { section: string; data: any }[] | null;
    const error = result.error;

    if (error) {
      console.error("Error fetching content:", error);
      return getDefaultContent();
    }

    const map: Record<string, any> = {};
    for (const row of data || []) {
      map[row.section] = row.data;
    }

    const def = getDefaultContent();

    return {
      skills: (map.skills?.items as SkillCategory[]) || def.skills,
      experience: (map.experience as Experience) || def.experience,
      projects: (map.projects?.items as Project[]) || def.projects,
      hero: (map.hero as Hero) || def.hero,
      social: (map.social as Social) || def.social,
      email: (map.email as Email) || def.email,
      footer: (map.footer as Footer) || def.footer,
      reviews: (map.reviews?.items as Review[]) || def.reviews,
      theme: (map.theme as ThemeConfig) || def.theme,
      pages: (map.pages?.items as Page[]) || def.pages,
      layout: (map.layout as LayoutConfig) || def.layout,
    };
  } catch {
    return getDefaultContent();
  }
}

export async function getContentSection(
  section: string
): Promise<Record<string, any> | null> {
  try {
    const supabase = getPublicClient();
    const result = await supabase
      .from("content")
      .select("data")
      .eq("section", section)
      .single();
    const data = result.data as { data: any } | null;
    const error = result.error;
    if (error || !data) return null;
    return data.data;
  } catch {
    return null;
  }
}

export async function getTheme(): Promise<ThemeConfig | null> {
  const data = await getContentSection("theme");
  return data as ThemeConfig | null;
}

export async function getLayout(): Promise<LayoutConfig | null> {
  const data = await getContentSection("layout");
  return data as LayoutConfig | null;
}

export async function getPages(): Promise<Page[]> {
  const data = await getContentSection("pages");
  return (data?.items as Page[]) || [];
}

export async function updateContent(
  section: string,
  data: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  try {
    let supabase: any;
    try {
      supabase = getAdminClient();
    } catch {
      supabase = getPublicClient();
    }

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
