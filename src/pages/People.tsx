import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import { Search, Users, MapPin, Briefcase, Filter } from "lucide-react";
import { mockPeople, RoleType } from "@/data/mockPeople";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

const ROLES: RoleType[] = ["Startup", "Incubator", "Investor", "Expert", "Creator", "Normal"];

const People = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleType | "All">("All");
  const { user } = useAuth();
  const [connectionStates, setConnectionStates] = useState<Record<string, "connect" | "pending" | "connected">>({});

  const filteredPeople = useMemo(() => {
    return mockPeople.filter(person => {
      const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            person.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            person.company?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRole === "All" || person.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [searchQuery, selectedRole]);

  const handleConnect = (id: string) => {
    if (!user) {
      // should trigger login, but for dummy we just alert
      alert("Please login to connect");
      return;
    }
    
    setConnectionStates(prev => ({
      ...prev,
      [id]: prev[id] === "pending" ? "connected" : "pending"
    }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col w-full overflow-x-hidden">
      <Helmet>
        <title>People Directory | India's Got Startup</title>
        <meta name="description" content="Discover and connect with founders, investors, creators, and experts in the Indian startup ecosystem." />
      </Helmet>

      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Hero Section */}
      <section className="w-full pt-20 pb-12 relative bg-gradient-to-b from-primary/5 via-background to-background border-b border-border/50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold tracking-wider uppercase mb-6 mx-auto">
            <Users className="h-4 w-4" />
            Ecosystem Network
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">People</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find and connect with founders, investors, experts, and creators shaping the future of Indian startups.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-lg">Filter Network</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Role Type</h4>
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant={selectedRole === "All" ? "default" : "outline"} 
                      className="justify-start" 
                      onClick={() => setSelectedRole("All")}
                    >
                      All Roles
                    </Button>
                    {ROLES.map(role => (
                      <Button 
                        key={role}
                        variant={selectedRole === role ? "default" : "outline"} 
                        className="justify-start"
                        onClick={() => setSelectedRole(role)}
                      >
                        {role}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-center bg-card/50 border border-border/50 p-4 rounded-xl">
              <p className="text-muted-foreground font-medium">
                Showing <span className="text-foreground font-bold">{filteredPeople.length}</span> professionals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPeople.map((person) => {
                const connState = connectionStates[person.id] || "connect";
                
                return (
                  <div key={person.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:border-primary/30 flex flex-col">
                    <div className="h-20 bg-gradient-to-r from-primary/20 to-primary/5 w-full"></div>
                    <div className="px-6 pb-6 relative flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <Avatar className="h-20 w-20 border-4 border-card -mt-10 bg-muted">
                          <AvatarImage src={person.avatar_url} />
                          <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Badge variant="outline" className="mt-2 bg-background/50 backdrop-blur-sm">
                          {person.role}
                        </Badge>
                      </div>
                      
                      <div className="mb-4 flex-1">
                        <Link to={`/user/${person.id}`} className="hover:underline">
                          <h3 className="text-xl font-bold flex items-center gap-1.5">
                            {person.name}
                            {person.isVerified && (
                              <svg className="w-4 h-4 text-blue-500 fill-current" viewBox="0 0 20 20">
                                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                              </svg>
                            )}
                          </h3>
                        </Link>
                        <p className="text-sm font-medium text-foreground mt-1">
                          {person.title} {person.company && `at ${person.company}`}
                        </p>
                        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3"/> {person.location}</span>
                          <span className="flex items-center gap-1"><Users className="h-3 w-3"/> {person.followersCount} followers</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
                          {person.bio}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {person.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[10px] font-medium px-2 py-1 bg-muted rounded-md text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <Button 
                        onClick={() => handleConnect(person.id)}
                        variant={connState === "connected" ? "outline" : (connState === "pending" ? "secondary" : "default")}
                        className="w-full font-semibold"
                      >
                        {connState === "connected" && "Connected"}
                        {connState === "pending" && "Pending..."}
                        {connState === "connect" && "Connect"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default People;
