import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  HelpCircle, 
  BookOpen, 
  MessageSquare, 
  Bookmark, 
  Clock, 
  TrendingUp,
  Sparkles,
  Shield,
  Lightbulb,
  Wallet,
  PenLine,
  Users,
  CheckCircle2
} from "lucide-react";

export function EarningsExplanation() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <HelpCircle className="h-4 w-4 mr-2" />
          How You Earn
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">How You Earn</DialogTitle>
          <DialogDescription>
            Create great content, build your audience, grow your income
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Section 1: Simple Overview */}
          <section className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              How It Works
            </h3>
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm leading-relaxed">
                Readers pay a monthly subscription to access content on this platform. 
                A portion of every subscription is shared directly with creators like you. 
                <strong className="text-foreground"> Your earnings are based on engagement — not just views.</strong> 
                The more readers interact with your content, the more you earn.
              </p>
            </div>
          </section>

          {/* Section 2: Engagement Point System */}
          <section className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Engagement Point System
            </h3>
            <p className="text-sm text-muted-foreground">
              You earn points when readers genuinely engage with your content:
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
                  <div className="text-sm text-muted-foreground">+1 point</div>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Points are collected throughout the month across all your published articles.
            </p>
          </section>

          {/* Section 3: How Points Turn Into Money */}
          <section className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              How Points Turn Into Money
            </h3>
            <div className="p-4 rounded-lg bg-muted text-sm space-y-3">
              <p className="leading-relaxed">
                At the end of each month, we add up all the engagement points earned by every creator. 
                Your share of the total points determines your share of earnings for that month.
              </p>
              <div className="p-3 rounded-lg bg-background border border-primary/20">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Simple way to think about it:</strong><br />
                  If you earn about 10% of all engagement that month, you receive about 10% of the creator payouts.
                </p>
              </div>
              <div className="mt-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-sm">
                  <strong className="text-green-700 dark:text-green-400">What can you expect?</strong><br />
                  Creators with strong engagement typically earn between <strong>₹500 to ₹3,000 per month</strong> early on. 
                  As you grow your readership and engagement, your earnings grow too.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: What Affects Your Earnings */}
          <section className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              What Affects Your Earnings
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>Quality of your content</span>
              </div>
              <div className="flex items-center gap-2 p-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>Reader interaction</span>
              </div>
              <div className="flex items-center gap-2 p-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>Publishing consistency</span>
              </div>
              <div className="flex items-center gap-2 p-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>Time readers spend reading</span>
              </div>
            </div>
          </section>

          {/* Section 5: How to Earn More */}
          <section className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              How to Earn More
            </h3>
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <PenLine className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <span>Write helpful, original content that provides real value</span>
              </li>
              <li className="flex items-start gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <span>Encourage comments and start discussions with your readers</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <span>Post regularly to keep readers coming back</span>
              </li>
              <li className="flex items-start gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <span>Keep readers engaged till the very end of your articles</span>
              </li>
            </ul>
          </section>

          {/* Section 6: Payout Rules */}
          <section className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Payout Rules
            </h3>
            <div className="p-4 rounded-lg bg-muted">
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Earnings are calculated at the end of each month</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Minimum payout threshold: <strong>₹300</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>If you haven't reached ₹300, your balance carries forward to the next month</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Payouts are made via <strong>UPI</strong> or <strong>bank transfer</strong></span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 7: Transparency Promise */}
          <section className="p-4 rounded-lg border border-primary/20 bg-primary/5">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Transparency Promise
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ All your points and earnings are visible in your dashboard</li>
              <li>✓ No hidden rules or mysterious calculations</li>
              <li>✓ No manual changes — everything is calculated automatically</li>
            </ul>
          </section>

          {/* Encouraging Footer */}
          <div className="text-center pt-2 pb-1">
            <p className="text-sm text-muted-foreground italic">
              If you create value for readers, you can grow your income here.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
