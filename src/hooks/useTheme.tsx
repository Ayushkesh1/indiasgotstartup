import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export type Theme = "light" | "dark";

export function useTheme() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [theme, setThemeState] = useState<Theme>("light");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("theme")
          .eq("id", user.id)
          .single();
        
        const savedTheme = (data?.theme as Theme) || "light";
        setThemeState(savedTheme);
        applyTheme(savedTheme);
      } else {
        const localTheme = (localStorage.getItem("theme") as Theme) || "light";
        setThemeState(localTheme);
        applyTheme(localTheme);
      }
      setLoading(false);
    };

    loadTheme();
  }, [user]);

  const applyTheme = (newTheme: Theme) => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
  };

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);

    if (user) {
      const { error } = await supabase
        .from("profiles")
        .update({ theme: newTheme })
        .eq("id", user.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to save theme preference",
          variant: "destructive",
        });
      }
    } else {
      localStorage.setItem("theme", newTheme);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return { theme, setTheme, toggleTheme, loading };
}
