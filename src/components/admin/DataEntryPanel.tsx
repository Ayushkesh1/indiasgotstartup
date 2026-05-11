import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Database, Building2, Users, Calendar, FileText } from "lucide-react";

export function DataEntryPanel() {
  const navigate = useNavigate();

  const entryPoints = [
    { title: "Add Startup", description: "Create a new startup profile", icon: Building2, path: "/startups/submit" },
    { title: "Add Investor", description: "Create an investor profile", icon: Users, path: "/investors/submit" },
    { title: "Add Incubator", description: "Create an incubator profile", icon: Building2, path: "/incubators/submit" },
    { title: "Create Event", description: "Publish a new ecosystem event", icon: Calendar, path: "/events/create" },
    { title: "Create Grant", description: "Publish a funding opportunity", icon: FileText, path: "/grants/create" },
    { title: "Write Article", description: "Publish a news or story article", icon: PlusCircle, path: "/write" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            Internal Content Management
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Populate the platform database directly without requiring frontend user accounts. Use these quick links to add content to the ecosystem.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entryPoints.map((entry) => (
          <Card key={entry.path} className="hover:border-primary/50 transition-all cursor-pointer group" onClick={() => navigate(entry.path)}>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                <entry.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{entry.title}</CardTitle>
                <CardDescription>{entry.description}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
