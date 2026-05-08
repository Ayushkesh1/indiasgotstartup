import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type LeaderboardMetric = "views" | "earnings" | "followers";
export type TimeRange = "all" | "month" | "week";

export interface LeaderboardEntry {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  metric_value: number;
  article_count: number;
}

export function useLeaderboard(metric: LeaderboardMetric, timeRange: TimeRange = "all") {
  return useQuery({
    queryKey: ["leaderboard", metric, timeRange],
    queryFn: async () => {
      let query;
      
      if (metric === "views") {
        // Get authors by total article views
        const { data, error } = await supabase
          .from("articles")
          .select(`
            author_id,
            views_count,
            profiles!articles_author_id_fkey(id, full_name, avatar_url, bio)
          `)
          .eq("published", true);

        if (error) throw error;

        // Aggregate views by author
        const authorViews = data.reduce((acc: any, article: any) => {
          const authorId = article.author_id;
          if (!acc[authorId]) {
            acc[authorId] = {
              id: authorId,
              full_name: article.profiles?.full_name,
              avatar_url: article.profiles?.avatar_url,
              bio: article.profiles?.bio,
              metric_value: 0,
              article_count: 0,
            };
          }
          acc[authorId].metric_value += article.views_count;
          acc[authorId].article_count += 1;
          return acc;
        }, {});

        return Object.values(authorViews)
          .sort((a: any, b: any) => b.metric_value - a.metric_value)
          .slice(0, 50) as LeaderboardEntry[];
      } 
      
      else if (metric === "earnings") {
        // Get authors by total earnings
        const { data, error } = await supabase
          .from("earnings")
          .select(`
            user_id,
            amount,
            profiles!earnings_user_id_fkey(id, full_name, avatar_url, bio)
          `)
          .eq("status", "paid");

        if (error) throw error;

        // Aggregate earnings by user
        const userEarnings = data.reduce((acc: any, earning: any) => {
          const userId = earning.user_id;
          if (!acc[userId]) {
            acc[userId] = {
              id: userId,
              full_name: earning.profiles?.full_name,
              avatar_url: earning.profiles?.avatar_url,
              bio: earning.profiles?.bio,
              metric_value: 0,
              article_count: 0,
            };
          }
          acc[userId].metric_value += Number(earning.amount);
          return acc;
        }, {});

        // Get article counts
        const { data: articlesData } = await supabase
          .from("articles")
          .select("author_id")
          .eq("published", true);

        articlesData?.forEach((article) => {
          if (userEarnings[article.author_id]) {
            userEarnings[article.author_id].article_count += 1;
          }
        });

        return Object.values(userEarnings)
          .sort((a: any, b: any) => b.metric_value - a.metric_value)
          .slice(0, 50) as LeaderboardEntry[];
      }
      
      else if (metric === "followers") {
        // Get authors by follower count
        const { data, error } = await supabase
          .from("follows")
          .select(`
            author_id,
            profiles!follows_author_id_fkey(id, full_name, avatar_url, bio)
          `);

        if (error) throw error;

        // Aggregate followers by author
        const authorFollowers = data.reduce((acc: any, follow: any) => {
          const authorId = follow.author_id;
          if (!acc[authorId]) {
            acc[authorId] = {
              id: authorId,
              full_name: follow.profiles?.full_name,
              avatar_url: follow.profiles?.avatar_url,
              bio: follow.profiles?.bio,
              metric_value: 0,
              article_count: 0,
            };
          }
          acc[authorId].metric_value += 1;
          return acc;
        }, {});

        // Get article counts
        const { data: articlesData } = await supabase
          .from("articles")
          .select("author_id")
          .eq("published", true);

        articlesData?.forEach((article) => {
          if (authorFollowers[article.author_id]) {
            authorFollowers[article.author_id].article_count += 1;
          }
        });

        return Object.values(authorFollowers)
          .sort((a: any, b: any) => b.metric_value - a.metric_value)
          .slice(0, 50) as LeaderboardEntry[];
      }

      return [];
    },
  });
}
