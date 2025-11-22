import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserManagement } from "@/hooks/useUserManagement";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Shield, UserCog, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export function UserManagementTable() {
  const { data: users, isLoading, assignRole, removeRole } = useUserManagement();
  const [pendingAction, setPendingAction] = useState<{
    type: "assign" | "remove";
    userId: string;
    role: "admin" | "moderator" | "user";
  } | null>(null);

  const handleAssignRole = (userId: string, role: string) => {
    setPendingAction({ type: "assign", userId, role: role as "admin" | "moderator" | "user" });
  };

  const handleRemoveRole = (userId: string, role: string) => {
    setPendingAction({ type: "remove", userId, role: role as "admin" | "moderator" | "user" });
  };

  const confirmAction = () => {
    if (!pendingAction) return;

    if (pendingAction.type === "assign") {
      assignRole.mutate({ userId: pendingAction.userId, role: pendingAction.role });
    } else {
      removeRole.mutate({ userId: pendingAction.userId, role: pendingAction.role });
    }
    setPendingAction(null);
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Member Since</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar_url || ""} />
                        <AvatarFallback>
                          {user.full_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {user.full_name || "Anonymous"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {user.roles.map((role) => (
                        <Badge
                          key={role}
                          variant={role === "admin" ? "default" : "secondary"}
                          className="gap-1"
                        >
                          {role === "admin" && <Shield className="h-3 w-3" />}
                          {role === "moderator" && <UserCog className="h-3 w-3" />}
                          {role}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => handleRemoveRole(user.id, role)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                      {user.roles.length === 0 && (
                        <Badge variant="outline">user</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Select onValueChange={(role) => handleAssignRole(user.id, role)}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Assign role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <AlertDialog open={!!pendingAction} onOpenChange={() => setPendingAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingAction?.type === "assign" ? "Assign Role" : "Remove Role"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction?.type === "assign"
                ? `Are you sure you want to assign the ${pendingAction.role} role to this user?`
                : `Are you sure you want to remove the ${pendingAction?.role} role from this user?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
