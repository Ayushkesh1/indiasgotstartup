import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminSession } from "@/hooks/useAdminSession";

interface AdminSessionGuardProps {
  children: ReactNode;
}

export function AdminSessionGuard({ children }: AdminSessionGuardProps) {
  const { isAuthenticated, isLoading } = useAdminSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/admin-login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
