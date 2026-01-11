import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HelpCircle, BookOpen, MessageSquare, Bookmark, Clock, IndianRupee, Users, PieChart } from "lucide-react";

export function EarningsExplanation() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <HelpCircle className="h-4 w-4 mr-2" />
          How Earnings Work
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">How You Earn Money</DialogTitle>
          <DialogDescription>
            A transparent, engagement-based revenue sharing model
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Subscription Model */}
          <section className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-primary" />
              Subscription Model
            </h3>
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm">
                Every subscriber pays <strong>₹100/month</strong>. No ads. No other tiers.
                Simple and transparent.
              </p>
            </div>
          </section>

          {/* Revenue Split */}
          <section className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Revenue Split
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="text-2xl font-bold text-green-600">60%</div>
                <div className="text-sm text-muted-foreground">Creator Pool</div>
                <p className="text-xs mt-2">Distributed to creators based on engagement</p>
              </div>
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="text-2xl font-bold text-blue-600">40%</div>
                <div className="text-sm text-muted-foreground">Platform</div>
                <p className="text-xs mt-2">Keeps the platform running</p>
              </div>
            </div>
          </section>

          {/* Engagement Points */}
          <section className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Engagement Points System
            </h3>
            <p className="text-sm text-muted-foreground">
              You earn points when readers engage with your content:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="p-2 rounded-full bg-blue-500/10">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <div className="font-medium">Full Read</div>
                  <div className="text-sm text-muted-foreground">1 point</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="p-2 rounded-full bg-green-500/10">
                  <MessageSquare className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <div className="font-medium">Comment</div>
                  <div className="text-sm text-muted-foreground">3 points</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="p-2 rounded-full bg-amber-500/10">
                  <Bookmark className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <div className="font-medium">Bookmark</div>
                  <div className="text-sm text-muted-foreground">2 points</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="p-2 rounded-full bg-purple-500/10">
                  <Clock className="h-4 w-4 text-purple-500" />
                </div>
                <div>
                  <div className="font-medium">Long Read Bonus</div>
                  <div className="text-sm text-muted-foreground">1 point</div>
                </div>
              </div>
            </div>
          </section>

          {/* Calculation Example */}
          <section className="space-y-3">
            <h3 className="font-semibold">Example Calculation</h3>
            <div className="p-4 rounded-lg bg-muted text-sm space-y-2">
              <p>Let's say this month:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>100 subscribers → ₹10,000 total revenue</li>
                <li>Creator Pool = 60% = <strong>₹6,000</strong></li>
                <li>Total engagement points from all creators = 1,000</li>
                <li>Your engagement points = 150</li>
              </ul>
              <div className="mt-4 p-3 rounded bg-background border">
                <strong>Your Earnings = </strong>
                (150 ÷ 1,000) × ₹6,000 = <strong className="text-green-600">₹900</strong>
              </div>
            </div>
          </section>

          {/* Payout Rules */}
          <section className="space-y-3">
            <h3 className="font-semibold">Payout Rules</h3>
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Payouts are calculated at the end of each month</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Minimum payout threshold: <strong>₹300</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>If you don't reach ₹300, balance carries over to next month</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Payouts via UPI or bank transfer</span>
              </li>
            </ul>
          </section>

          {/* Transparency Note */}
          <section className="p-4 rounded-lg border border-primary/20 bg-primary/5">
            <h3 className="font-semibold mb-2">Our Promise</h3>
            <p className="text-sm text-muted-foreground">
              No hidden rules. No manual bias. Your earnings are calculated automatically 
              based on real engagement data that you can see in your dashboard.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
