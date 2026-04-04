import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check credentials against admin_credentials table
      const { data, error } = await supabase
        .from("admin_credentials")
        .select("*")
        .eq("username", username)
        .eq("password_hash", password)
        .eq("is_active", true)
        .single();

      if (error || !data) {
        toast({
          title: "Access Denied",
          description: "Invalid username or password",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Update last login
      await supabase
        .from("admin_credentials")
        .update({ last_login: new Date().toISOString() })
        .eq("id", data.id);

      // Store admin session in localStorage
      localStorage.setItem("admin_session", JSON.stringify({
        id: data.id,
        username: data.username,
        loginTime: new Date().toISOString(),
      }));

      toast({
        title: "Welcome, Admin!",
        description: "You have successfully logged in.",
      });

      navigate("/admin");
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="bg-gradient-subtle">
        <div className="container mx-auto grid min-h-[calc(100vh-3.5rem)] max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-12">
          <section className="relative overflow-hidden rounded-3xl border border-border bg-card/70 p-8 shadow-lg backdrop-blur-sm lg:p-10">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-primary/20 via-accent/10 to-transparent" />

            <div className="relative flex h-full flex-col justify-between gap-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Latest brand system is active
                </div>

                <div className="space-y-4">
                  <h1 className="max-w-xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                    India's Got Startup admin access.
                  </h1>
                  <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
                    Manage stories, users, revenue, and platform operations from the updated dashboard experience.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background/70 p-5">
                    <p className="mb-2 text-sm text-muted-foreground">Editorial control</p>
                    <p className="text-lg font-semibold text-foreground">Content, reports, and creator tools</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background/70 p-5">
                    <p className="mb-2 text-sm text-muted-foreground">Business ops</p>
                    <p className="text-lg font-semibold text-foreground">Revenue, partners, careers, and team</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button variant="outline" onClick={() => navigate("/") }>
                  Go to homepage
                </Button>
                <Button onClick={() => navigate("/about")}>
                  View brand site
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>

          <Card className="w-full rounded-3xl border-border bg-card/95 shadow-xl">
            <CardHeader className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl">Admin Login</CardTitle>
                <CardDescription>
                  Access the updated India's Got Startup admin dashboard
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login to Admin Panel"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
