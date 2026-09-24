import { supabase } from "./supabaseClient";
import { DestinationItem } from "@/data/destinationsData";

export async function fetchDestinationsFromDb(): Promise<DestinationItem[]> {
  try {
    const { data, error } = await supabase.from("destinations").select("*").order("name", { ascending: true });
    if (error || !data || data.length === 0) return [];
    return data.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      tagline: row.tagline || "",
      description: row.description || "",
      image: row.image || "",
      tourCount: row.tour_count || 0,
      bestTime: row.best_time || "",
      idealDuration: row.ideal_duration || "",
      avgBudget: row.avg_budget || "",
      attractions: Array.isArray(row.attractions) ? row.attractions : [],
      seoTitle: row.seo_title || undefined,
      seoDescription: row.seo_description || undefined,
    }));
  } catch (err) {
    console.warn("fetchDestinationsFromDb notice:", err);
    return [];
  }
}

export async function createDestinationInDb(d: DestinationItem): Promise<boolean> {
  try {
    const { error } = await supabase.from("destinations").upsert({
      id: d.id,
      slug: d.slug,
      name: d.name,
      tagline: d.tagline,
      description: d.description,
      image: d.image,
      tour_count: d.tourCount,
      best_time: d.bestTime,
      ideal_duration: d.idealDuration,
      avg_budget: d.avgBudget,
      attractions: d.attractions || [],
      seo_title: d.seoTitle || null,
      seo_description: d.seoDescription || null,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      console.warn("createDestinationInDb error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("createDestinationInDb exception:", err);
    return false;
  }
}

export async function updateDestinationInDb(d: DestinationItem): Promise<boolean> {
  return createDestinationInDb(d);
}

export async function deleteDestinationFromDb(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("destinations").delete().eq("id", id);
    if (error) {
      console.warn("deleteDestinationFromDb error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("deleteDestinationFromDb exception:", err);
    return false;
  }
}
