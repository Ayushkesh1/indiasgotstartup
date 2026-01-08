import { useEffect, useState } from "react";
import { Bell, DollarSign, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useEarningsStats } from "@/hooks/useEarnings";
import { usePayouts } from "@/hooks/usePayouts";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "payout_ready" | "milestone" | "payout_completed";
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export function EarningsNotifications() {
  const { user } = useAuth();
  const { data: stats } = useEarningsStats(user?.id);
  const { data: payouts } = usePayouts(user?.id);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!stats || !payouts) return;

    const newNotifications: Notification[] = [];
    const storedDismissed = localStorage.getItem("earnings_dismissed_notifications") || "[]";
    const dismissedIds = JSON.parse(storedDismissed);

    // Check if earnings are ready for payout (>= $10)
    const availableAmount = stats.total - stats.paid;
    if (availableAmount >= 10) {
      const payoutReadyId = "payout_ready_" + Math.floor(availableAmount / 10);
      if (!dismissedIds.includes(payoutReadyId)) {
        newNotifications.push({
          id: payoutReadyId,
          type: "payout_ready",
          title: "Ready for Payout!",
          message: `You have $${availableAmount.toFixed(2)} available for payout. Request your earnings now!`,
          read: false,
          createdAt: new Date(),
        });
      }
    }

    // Check for milestone achievements
    const milestones = [10, 50, 100, 500, 1000];
    milestones.forEach((milestone) => {
      if (stats.total >= milestone) {
        const milestoneId = `milestone_${milestone}`;
        if (!dismissedIds.includes(milestoneId)) {
          newNotifications.push({
            id: milestoneId,
            type: "milestone",
            title: `$${milestone} Milestone!`,
            message: `Congratulations! You've earned over $${milestone} from your articles.`,
            read: false,
            createdAt: new Date(),
          });
        }
      }
    });

    // Check for completed payouts
    const completedPayouts = payouts.filter((p) => p.status === "completed");
    completedPayouts.forEach((payout) => {
      const payoutId = `payout_completed_${payout.id}`;
      if (!dismissedIds.includes(payoutId)) {
        newNotifications.push({
          id: payoutId,
          type: "payout_completed",
          title: "Payout Completed!",
          message: `Your payout of $${Number(payout.amount).toFixed(2)} has been processed.`,
          read: false,
          createdAt: new Date(payout.completed_at || payout.updated_at),
        });
      }
    });

    setNotifications(newNotifications);
  }, [stats, payouts]);

  const dismissNotification = (id: string) => {
    const storedDismissed = localStorage.getItem("earnings_dismissed_notifications") || "[]";
    const dismissedIds = JSON.parse(storedDismissed);
    dismissedIds.push(id);
    localStorage.setItem("earnings_dismissed_notifications", JSON.stringify(dismissedIds));
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground text-xs"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute right-0 top-12 z-50 w-80 sm:w-96 border-0 shadow-2xl">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Earnings Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 max-h-[400px] overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors",
                    !notification.read && "bg-primary/5"
                  )}
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0",
                      notification.type === "payout_ready" && "bg-success/10",
                      notification.type === "milestone" && "bg-primary/10",
                      notification.type === "payout_completed" && "bg-success/10"
                    )}
                  >
                    {notification.type === "payout_ready" && (
                      <DollarSign className="h-5 w-5 text-success" />
                    )}
                    {notification.type === "milestone" && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                    {notification.type === "payout_completed" && (
                      <CheckCircle className="h-5 w-5 text-success" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{notification.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {notification.message}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      dismissNotification(notification.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
