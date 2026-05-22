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

    return {
      skills: (map.skills?.items as SkillCategory[]) || getDefaultContent().skills,
      experience: (map.experience as Experience) || getDefaultContent().experience,
      projects: (map.projects?.items as Project[]) || getDefaultContent().projects,
      hero: (map.hero as Hero) || getDefaultContent().hero,
      social: (map.social as Social) || getDefaultContent().social,
      email: (map.email as Email) || getDefaultContent().email,
      footer: (map.footer as Footer) || getDefaultContent().footer,
      reviews: (map.reviews?.items as Review[]) || getDefaultContent().reviews,
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
