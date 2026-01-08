import { useEffect, useState } from "react";
import { Bell, DollarSign, CheckCircle, X, Trophy, TrendingUp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useEarningsStats } from "@/hooks/useEarnings";
import { usePayouts } from "@/hooks/usePayouts";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "payout_ready" | "milestone" | "payout_completed" | "streak" | "first_earning";
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  icon?: "trophy" | "dollar" | "check" | "star" | "trending";
}

const MILESTONES = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];

export function EarningsNotifications() {
  const { user } = useAuth();
  const { data: stats } = useEarningsStats(user?.id);
  const { data: payouts } = usePayouts(user?.id);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasShownToast, setHasShownToast] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!stats || !payouts) return;

    const newNotifications: Notification[] = [];
    const storedDismissed = localStorage.getItem("earnings_dismissed_notifications") || "[]";
    const dismissedIds = JSON.parse(storedDismissed);
    const storedToasts = localStorage.getItem("earnings_shown_toasts") || "[]";
    const shownToasts = new Set<string>(JSON.parse(storedToasts));

    // First earning celebration
    if (stats.total > 0 && stats.total < 1) {
      const firstEarningId = "first_earning";
      if (!dismissedIds.includes(firstEarningId)) {
        newNotifications.push({
          id: firstEarningId,
          type: "first_earning",
          title: "First Earnings! 🎉",
          message: "Congratulations on your first earnings! Keep writing to earn more.",
          read: false,
          createdAt: new Date(),
          icon: "star",
        });
        
        if (!shownToasts.has(firstEarningId)) {
          toast.success("First Earnings!", {
            description: "Congratulations on your first earnings! 🎉",
          });
          shownToasts.add(firstEarningId);
        }
      }
    }

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
          icon: "dollar",
        });

        if (!shownToasts.has(payoutReadyId)) {
          toast.success("Payout Ready!", {
            description: `You have $${availableAmount.toFixed(2)} available for payout.`,
          });
          shownToasts.add(payoutReadyId);
        }
      }
    }

    // Check for milestone achievements
    MILESTONES.forEach((milestone) => {
      if (stats.total >= milestone) {
        const milestoneId = `milestone_${milestone}`;
        if (!dismissedIds.includes(milestoneId)) {
          newNotifications.push({
            id: milestoneId,
            type: "milestone",
            title: `$${milestone} Milestone! 🏆`,
            message: `Amazing! You've earned over $${milestone} from your articles. Keep up the great work!`,
            read: false,
            createdAt: new Date(),
            icon: "trophy",
          });

          if (!shownToasts.has(milestoneId)) {
            toast.success(`$${milestone} Milestone! 🏆`, {
              description: `You've earned over $${milestone} from your articles!`,
            });
            shownToasts.add(milestoneId);
          }
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
          title: "Payout Completed! ✅",
          message: `Your payout of $${Number(payout.amount).toFixed(2)} has been successfully processed.`,
          read: false,
          createdAt: new Date(payout.completed_at || payout.updated_at),
          icon: "check",
        });

        if (!shownToasts.has(payoutId)) {
          toast.success("Payout Completed!", {
            description: `Your payout of $${Number(payout.amount).toFixed(2)} has been processed.`,
          });
          shownToasts.add(payoutId);
        }
      }
    });

    // Store shown toasts
    localStorage.setItem("earnings_shown_toasts", JSON.stringify([...shownToasts]));
    setHasShownToast(shownToasts);
    setNotifications(newNotifications);
  }, [stats, payouts]);

  const dismissNotification = (id: string) => {
    const storedDismissed = localStorage.getItem("earnings_dismissed_notifications") || "[]";
    const dismissedIds = JSON.parse(storedDismissed);
    dismissedIds.push(id);
    localStorage.setItem("earnings_dismissed_notifications", JSON.stringify(dismissedIds));
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const dismissAll = () => {
    const storedDismissed = localStorage.getItem("earnings_dismissed_notifications") || "[]";
    const dismissedIds = JSON.parse(storedDismissed);
    notifications.forEach((n) => dismissedIds.push(n.id));
    localStorage.setItem("earnings_dismissed_notifications", JSON.stringify(dismissedIds));
    setNotifications([]);
    setIsOpen(false);
  };

  const getIcon = (notification: Notification) => {
    switch (notification.icon) {
      case "trophy":
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case "dollar":
        return <DollarSign className="h-5 w-5 text-success" />;
      case "check":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "star":
        return <Star className="h-5 w-5 text-yellow-500" />;
      case "trending":
        return <TrendingUp className="h-5 w-5 text-primary" />;
      default:
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (notifications.length === 0) {
    return (
      <Button variant="outline" size="icon" className="relative opacity-50" disabled>
        <Bell className="h-5 w-5" />
      </Button>
    );
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
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground text-xs animate-pulse"
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
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notifications
                </CardTitle>
                {notifications.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={dismissAll}>
                    Clear all
                  </Button>
                )}
              </div>
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
                      notification.type === "milestone" && "bg-yellow-500/10",
                      notification.type === "payout_completed" && "bg-success/10",
                      notification.type === "first_earning" && "bg-yellow-500/10"
                    )}
                  >
                    {getIcon(notification)}
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
