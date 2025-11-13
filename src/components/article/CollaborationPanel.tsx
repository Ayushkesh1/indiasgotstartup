import { useState } from "react";
import { Users, UserPlus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useCollaboration } from "@/hooks/useCollaboration";

interface CollaborationPanelProps {
  articleId: string | undefined;
}

export function CollaborationPanel({ articleId }: CollaborationPanelProps) {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState<"view" | "edit" | "admin">("edit");
  const [isOpen, setIsOpen] = useState(false);
  const { collaborators, activeUsers, inviteCollaborator, removeCollaborator } = useCollaboration(articleId);

  const handleInvite = async () => {
    await inviteCollaborator(email, permission);
    setEmail("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Users className="h-4 w-4" />
          Collaborate ({activeUsers.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Collaboration
          </DialogTitle>
          <DialogDescription>
            Invite others to co-author this article in real-time
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Active Users */}
          {activeUsers.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Active Now</h3>
              <div className="flex flex-wrap gap-2">
                {activeUsers.map((user) => (
                  <div
                    key={user.user_id}
                    className="flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1.5"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.avatar_url || ""} />
                      <AvatarFallback>
                        {user.full_name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{user.full_name || "Anonymous"}</span>
                    <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invite New Collaborator */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Invite Collaborator</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Select value={permission} onValueChange={(v: any) => setPermission(v)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View</SelectItem>
                  <SelectItem value="edit">Edit</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleInvite} disabled={!email}>
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Collaborators List */}
          {collaborators.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Collaborators</h3>
              <div className="space-y-2">
                {collaborators.map((collab) => (
                  <Card key={collab.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={collab.profiles?.avatar_url || ""} />
                          <AvatarFallback>
                            {collab.profiles?.full_name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {collab.profiles?.full_name || "Unknown"}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {collab.permission}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCollaborator(collab.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
