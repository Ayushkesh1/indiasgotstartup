import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { GRANTS_DATA } from "@/data/grants";
import { EVENTS_DATA } from "@/data/events";

export type SearchResultType = "people" | "startup" | "investor" | "incubator" | "event" | "grant" | "article";

export interface UniversalSearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  image?: string;
  slug?: string;
  location?: string;
  tags?: string[];
}

export const useUniversalSearch = (query: string, limit = 5) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  return useQuery({
    queryKey: ["universal-search", debouncedQuery],
    queryFn: async (): Promise<Record<SearchResultType, UniversalSearchResult[]>> => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        return {
          people: [],
          startup: [],
          investor: [],
          incubator: [],
          event: [],
          grant: [],
          article: [],
        };
      }

      const searchTerm = `%${debouncedQuery}%`;

      // Parallel fetching from multiple tables with individual error handling
      const fetchResults = async (table: string, queryBuilder: any) => {
        try {
          const { data, error } = await queryBuilder;
          if (error) {
            console.warn(`Search error for ${table}:`, error.message);
            return [];
          }
          return data || [];
        } catch (err) {
          console.warn(`Search catch error for ${table}:`, err);
          return [];
        }
      };

      const [
        peopleData,
        startupData,
        investorData,
        incubatorData,
        eventData,
        grantData,
        articleData,
      ] = await Promise.all([
        fetchResults("profiles", supabase.from("profiles").select("id, full_name, avatar_url, bio").or(`full_name.ilike.${searchTerm},bio.ilike.${searchTerm}`).limit(limit)),
        fetchResults("startups", supabase.from("startups").select("id, name, logo_url, tagline, slug, city, sector").or(`name.ilike.${searchTerm},tagline.ilike.${searchTerm},sector.ilike.${searchTerm},description.ilike.${searchTerm},city.ilike.${searchTerm},state.ilike.${searchTerm}`).eq('status', 'approved').limit(limit)),
        fetchResults("investors", supabase.from("investors").select("id, name, logo_url, tagline, slug, city, preferred_sectors").or(`name.ilike.${searchTerm},tagline.ilike.${searchTerm},preferred_sectors.ilike.${searchTerm},bio.ilike.${searchTerm},city.ilike.${searchTerm}`).eq('status', 'approved').limit(limit)),
        fetchResults("incubators", supabase.from("incubators").select("id, name, logo_url, tagline, slug, city, sector_focus").or(`name.ilike.${searchTerm},tagline.ilike.${searchTerm},sector_focus.ilike.${searchTerm},about.ilike.${searchTerm},city.ilike.${searchTerm}`).eq('status', 'approved').limit(limit)),
        fetchResults("events", supabase.from("events").select("id, title, banner_url, location, event_type, slug").or(`title.ilike.${searchTerm},description.ilike.${searchTerm},location.ilike.${searchTerm},event_type.ilike.${searchTerm}`).eq('status', 'approved').limit(limit)),
        fetchResults("grants", supabase.from("grants").select("id, name, sector, category, slug").or(`name.ilike.${searchTerm},description.ilike.${searchTerm},sector.ilike.${searchTerm},category.ilike.${searchTerm}`).eq('status', 'approved').limit(limit)),
        fetchResults("articles", supabase.from("articles").select("id, title, featured_image_url, excerpt, slug").or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm}`).eq('published', true).limit(limit)),
      ]);

      const filterTest = (items: any[]) => items.filter(item => {
        const name = (item.name || item.title || item.full_name || "").toLowerCase();
        return !name.includes("test") && !name.includes("demo");
      });

      const filteredPeople = filterTest(peopleData);
      const filteredStartups = filterTest(startupData);
      const filteredInvestors = filterTest(investorData);
      const filteredIncubators = filterTest(incubatorData);
      const filteredEvents = filterTest(eventData);
      const filteredGrants = filterTest(grantData);
      const filteredArticles = filterTest(articleData);

      // Fallback to local data for grants and events if DB is empty
      const localEvents = EVENTS_DATA.filter(e => 
        (e.title.toLowerCase().includes(debouncedQuery.toLowerCase()) || 
        (e.description && e.description.toLowerCase().includes(debouncedQuery.toLowerCase()))) &&
        !e.title.toLowerCase().includes("test")
      ).slice(0, limit);

      const localGrants = GRANTS_DATA.filter(g => 
        (g.title.toLowerCase().includes(debouncedQuery.toLowerCase()) || 
        (g.description && g.description.toLowerCase().includes(debouncedQuery.toLowerCase())) ||
        g.tags.some(t => t.toLowerCase().includes(debouncedQuery.toLowerCase()))) &&
        !g.title.toLowerCase().includes("test")
      ).slice(0, limit);

      return {
        people: filteredPeople.map((p: any) => ({
          id: p.id,
          type: "people",
          title: p.full_name || "Anonymous",
          subtitle: p.bio || "Member",
          image: p.avatar_url || undefined,
        })),
        startup: filteredStartups.map((s: any) => ({
          id: s.id,
          type: "startup",
          title: s.name,
          subtitle: `${s.sector || ""} • ${s.city || ""}`,
          image: s.logo_url || undefined,
          slug: s.slug,
        })),
        investor: filteredInvestors.map((i: any) => ({
          id: i.id,
          type: "investor",
          title: i.name,
          subtitle: i.tagline || `${i.city || ""}`,
          image: i.logo_url || undefined,
          slug: i.slug,
        })),
        incubator: filteredIncubators.map((inc: any) => ({
          id: inc.id,
          type: "incubator",
          title: inc.name,
          subtitle: inc.tagline || `${inc.city || ""}`,
          image: inc.logo_url || undefined,
          slug: inc.slug,
        })),
        event: [...filteredEvents, ...localEvents].slice(0, limit).map((e: any) => ({
          id: e.id,
          type: "event",
          title: e.title,
          subtitle: `${e.event_type || ""} • ${e.location || ""}`,
          image: e.banner_url || undefined,
          slug: e.slug,
        })),
        grant: [...filteredGrants, ...localGrants].slice(0, limit).map((g: any) => ({
          id: g.id || g.title,
          type: "grant",
          title: g.name || g.title,
          subtitle: `${g.category || g.tags?.[0] || ""} • ${g.sector || g.organization || ""}`,
          slug: g.slug || g.id,
        })),
        article: filteredArticles.map((a: any) => ({
          id: a.id,
          type: "article",
          title: a.title,
          subtitle: a.excerpt || "Article",
          image: a.featured_image_url || undefined,
          slug: a.slug,
        })),
      };
    },
    enabled: debouncedQuery.length >= 2,
  });
};
