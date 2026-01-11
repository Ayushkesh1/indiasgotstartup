export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      advertisements: {
        Row: {
          bid_amount: number
          clicks: number
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          image_url: string
          impressions: number
          is_active: boolean
          link_url: string
          start_date: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bid_amount?: number
          clicks?: number
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          image_url: string
          impressions?: number
          is_active?: boolean
          link_url: string
          start_date?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bid_amount?: number
          clicks?: number
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string
          impressions?: number
          is_active?: boolean
          link_url?: string
          start_date?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      article_collaborators: {
        Row: {
          accepted_at: string | null
          article_id: string
          id: string
          invited_at: string
          permission: string
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          article_id: string
          id?: string
          invited_at?: string
          permission?: string
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          article_id?: string
          id?: string
          invited_at?: string
          permission?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_collaborators_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_reports: {
        Row: {
          article_id: string
          created_at: string
          description: string | null
          id: string
          reason: string
          reporter_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          article_id: string
          created_at?: string
          description?: string | null
          id?: string
          reason: string
          reporter_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          article_id?: string
          created_at?: string
          description?: string | null
          id?: string
          reason?: string
          reporter_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_reports_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_series: {
        Row: {
          author_id: string
          created_at: string
          description: string | null
          id: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          created_at?: string
          description?: string | null
          id?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          created_at?: string
          description?: string | null
          id?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      article_tags: {
        Row: {
          article_id: string
          created_at: string
          id: string
          tag_id: string
        }
        Insert: {
          article_id: string
          created_at?: string
          id?: string
          tag_id: string
        }
        Update: {
          article_id?: string
          created_at?: string
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_tags_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      article_views: {
        Row: {
          article_id: string
          id: string
          viewed_at: string
          viewer_id: string | null
        }
        Insert: {
          article_id: string
          id?: string
          viewed_at?: string
          viewer_id?: string | null
        }
        Update: {
          article_id?: string
          id?: string
          viewed_at?: string
          viewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "article_views_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author_id: string
          boost_expires_at: string | null
          boost_multiplier: number
          boosted_at: string | null
          category: Database["public"]["Enums"]["article_category"]
          content: Json
          created_at: string
          excerpt: string | null
          featured_image_url: string | null
          id: string
          is_boosted: boolean
          published: boolean
          published_at: string | null
          reading_time: number
          slug: string
          title: string
          updated_at: string
          views_count: number
        }
        Insert: {
          author_id: string
          boost_expires_at?: string | null
          boost_multiplier?: number
          boosted_at?: string | null
          category: Database["public"]["Enums"]["article_category"]
          content: Json
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_boosted?: boolean
          published?: boolean
          published_at?: string | null
          reading_time?: number
          slug: string
          title: string
          updated_at?: string
          views_count?: number
        }
        Update: {
          author_id?: string
          boost_expires_at?: string | null
          boost_multiplier?: number
          boosted_at?: string | null
          category?: Database["public"]["Enums"]["article_category"]
          content?: Json
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_boosted?: boolean
          published?: boolean
          published_at?: string | null
          reading_time?: number
          slug?: string
          title?: string
          updated_at?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmarks: {
        Row: {
          article_id: string
          bookmarked_at: string
          id: string
          is_read: boolean
          read_at: string | null
          user_id: string
        }
        Insert: {
          article_id: string
          bookmarked_at?: string
          id?: string
          is_read?: boolean
          read_at?: string | null
          user_id: string
        }
        Update: {
          article_id?: string
          bookmarked_at?: string
          id?: string
          is_read?: boolean
          read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_items: {
        Row: {
          added_at: string
          bookmark_id: string
          collection_id: string
          id: string
        }
        Insert: {
          added_at?: string
          bookmark_id: string
          collection_id: string
          id?: string
        }
        Update: {
          added_at?: string
          bookmark_id?: string
          collection_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_items_bookmark_id_fkey"
            columns: ["bookmark_id"]
            isOneToOne: false
            referencedRelation: "bookmarks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_items_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      comment_votes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_votes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_votes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments_public"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          article_id: string
          content: string
          created_at: string
          id: string
          parent_comment_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          article_id: string
          content: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          article_id?: string
          content?: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "comments_public"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_monthly_earnings: {
        Row: {
          bookmarks: number
          boosted_article_points: number
          comments: number
          created_at: string
          creator_id: string
          estimated_earnings: number
          final_earnings: number | null
          follower_bonus_points: number
          follower_engagements: number
          full_reads: number
          id: string
          is_paid: boolean
          long_read_bonuses: number
          month_year: string
          total_engagement_points: number
          updated_at: string
        }
        Insert: {
          bookmarks?: number
          boosted_article_points?: number
          comments?: number
          created_at?: string
          creator_id: string
          estimated_earnings?: number
          final_earnings?: number | null
          follower_bonus_points?: number
          follower_engagements?: number
          full_reads?: number
          id?: string
          is_paid?: boolean
          long_read_bonuses?: number
          month_year: string
          total_engagement_points?: number
          updated_at?: string
        }
        Update: {
          bookmarks?: number
          boosted_article_points?: number
          comments?: number
          created_at?: string
          creator_id?: string
          estimated_earnings?: number
          final_earnings?: number | null
          follower_bonus_points?: number
          follower_engagements?: number
          full_reads?: number
          id?: string
          is_paid?: boolean
          long_read_bonuses?: number
          month_year?: string
          total_engagement_points?: number
          updated_at?: string
        }
        Relationships: []
      }
      creator_payment_info: {
        Row: {
          bank_account_name: string | null
          bank_account_number: string | null
          bank_ifsc: string | null
          created_at: string
          creator_id: string
          id: string
          preferred_method: string | null
          updated_at: string
          upi_id: string | null
        }
        Insert: {
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_ifsc?: string | null
          created_at?: string
          creator_id: string
          id?: string
          preferred_method?: string | null
          updated_at?: string
          upi_id?: string | null
        }
        Update: {
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_ifsc?: string | null
          created_at?: string
          creator_id?: string
          id?: string
          preferred_method?: string | null
          updated_at?: string
          upi_id?: string | null
        }
        Relationships: []
      }
      creator_payouts: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string
          creator_id: string
          id: string
          notes: string | null
          payment_details: Json | null
          payment_method: string
          processed_at: string | null
          requested_at: string
          status: string
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string
          creator_id: string
          id?: string
          notes?: string | null
          payment_details?: Json | null
          payment_method: string
          processed_at?: string | null
          requested_at?: string
          status?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string
          creator_id?: string
          id?: string
          notes?: string | null
          payment_details?: Json | null
          payment_method?: string
          processed_at?: string | null
          requested_at?: string
          status?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      earnings: {
        Row: {
          amount: number
          article_id: string | null
          created_at: string
          description: string | null
          id: string
          points: number | null
          status: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          article_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          points?: number | null
          status?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          article_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          points?: number | null
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "earnings_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_events: {
        Row: {
          article_id: string
          created_at: string
          creator_id: string
          event_type: string
          follower_bonus_points: number
          id: string
          is_follower_engagement: boolean
          metadata: Json | null
          month_year: string
          points: number
          user_id: string
        }
        Insert: {
          article_id: string
          created_at?: string
          creator_id: string
          event_type: string
          follower_bonus_points?: number
          id?: string
          is_follower_engagement?: boolean
          metadata?: Json | null
          month_year: string
          points: number
          user_id: string
        }
        Update: {
          article_id?: string
          created_at?: string
          creator_id?: string
          event_type?: string
          follower_bonus_points?: number
          id?: string
          is_follower_engagement?: boolean
          metadata?: Json | null
          month_year?: string
          points?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "engagement_events_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          author_id: string
          created_at: string
          follower_id: string
          id: string
        }
        Insert: {
          author_id: string
          created_at?: string
          follower_id: string
          id?: string
        }
        Update: {
          author_id?: string
          created_at?: string
          follower_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      function_rate_limits: {
        Row: {
          function_name: string
          id: string
          request_count: number
          user_id: string
          window_start: string
        }
        Insert: {
          function_name: string
          id?: string
          request_count?: number
          user_id: string
          window_start?: string
        }
        Update: {
          function_name?: string
          id?: string
          request_count?: number
          user_id?: string
          window_start?: string
        }
        Relationships: []
      }
      monthly_revenue_pools: {
        Row: {
          created_at: string
          creator_pool: number
          finalized_at: string | null
          id: string
          is_finalized: boolean
          month_year: string
          platform_revenue: number
          total_engagement_points: number
          total_revenue: number
          total_subscribers: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_pool?: number
          finalized_at?: string | null
          id?: string
          is_finalized?: boolean
          month_year: string
          platform_revenue?: number
          total_engagement_points?: number
          total_revenue?: number
          total_subscribers?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_pool?: number
          finalized_at?: string | null
          id?: string
          is_finalized?: boolean
          month_year?: string
          platform_revenue?: number
          total_engagement_points?: number
          total_revenue?: number
          total_subscribers?: number
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          email: string
          id: string
          is_active: boolean
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      payouts: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string
          id: string
          notes: string | null
          payment_method: string
          points_redeemed: number | null
          requested_at: string
          status: string
          transaction_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          payment_method: string
          points_redeemed?: number | null
          requested_at?: string
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          payment_method?: string
          points_redeemed?: number | null
          requested_at?: string
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email_notifications: boolean
          full_name: string | null
          id: string
          linkedin_url: string | null
          theme: string | null
          twitter_handle: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email_notifications?: boolean
          full_name?: string | null
          id: string
          linkedin_url?: string | null
          theme?: string | null
          twitter_handle?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email_notifications?: boolean
          full_name?: string | null
          id?: string
          linkedin_url?: string | null
          theme?: string | null
          twitter_handle?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reading_progress: {
        Row: {
          article_id: string
          id: string
          last_read_at: string
          progress_percentage: number
          scroll_position: number
          user_id: string
        }
        Insert: {
          article_id: string
          id?: string
          last_read_at?: string
          progress_percentage?: number
          scroll_position?: number
          user_id: string
        }
        Update: {
          article_id?: string
          id?: string
          last_read_at?: string
          progress_percentage?: number
          scroll_position?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_progress_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      series_articles: {
        Row: {
          article_id: string
          created_at: string
          id: string
          position: number
          series_id: string
        }
        Insert: {
          article_id: string
          created_at?: string
          id?: string
          position: number
          series_id: string
        }
        Update: {
          article_id?: string
          created_at?: string
          id?: string
          position?: number
          series_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "series_articles_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "series_articles_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "article_series"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancelled_at: string | null
          created_at: string
          expires_at: string
          id: string
          payment_method: string | null
          started_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cancelled_at?: string | null
          created_at?: string
          expires_at: string
          id?: string
          payment_method?: string | null
          started_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cancelled_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          payment_method?: string | null
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      comments_public: {
        Row: {
          article_id: string | null
          avatar_url: string | null
          content: string | null
          created_at: string | null
          full_name: string | null
          id: string | null
          is_owner: boolean | null
          parent_comment_id: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "comments_public"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles_public: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string | null
          linkedin_url: string | null
          twitter_handle: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string | null
          linkedin_url?: string | null
          twitter_handle?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string | null
          linkedin_url?: string | null
          twitter_handle?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      get_article_comments: {
        Args: { article_id_param: string }
        Returns: {
          article_id: string
          avatar_url: string
          content: string
          created_at: string
          full_name: string
          id: string
          parent_comment_id: string
          updated_at: string
        }[]
      }
      get_comment_vote_count: {
        Args: { comment_id_param: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_ad_clicks: { Args: { ad_id: string }; Returns: undefined }
      increment_ad_impressions: { Args: { ad_id: string }; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      article_category:
        | "Fintech"
        | "Tech"
        | "Blockchain"
        | "eCommerce"
        | "Government"
        | "Edtech"
        | "Funding"
        | "Mobility"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      article_category: [
        "Fintech",
        "Tech",
        "Blockchain",
        "eCommerce",
        "Government",
        "Edtech",
        "Funding",
        "Mobility",
      ],
    },
  },
} as const
