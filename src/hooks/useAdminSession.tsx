import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AdminSession {
  id: string;
  username: string;
  loginTime: string;
}

export function useAdminSession() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("admin_session");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Check if session is less than 24 hours old
        const loginTime = new Date(parsed.loginTime);
        const now = new Date();
        const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          setSession(parsed);
        } else {
          localStorage.removeItem("admin_session");
        }
      } catch {
        localStorage.removeItem("admin_session");
      }
    }
    setIsLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("admin_session");
    setSession(null);
    navigate("/admin-login");
  };

  return { session, isLoading, logout, isAuthenticated: !!session };
}
