import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Heart } from "lucide-react";
import { SubmissionSuccessDialog } from "@/components/SubmissionSuccessDialog";

interface JoinMissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JoinMissionDialog({ open, onOpenChange }: JoinMissionDialogProps) {
  const [donationAmount, setDonationAmount] = useState<number[]>([100]);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenChange(false);
    setIsSuccessOpen(true);
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[600px] bg-background border-border text-foreground max-h-[90vh] overflow-y-auto w-full">
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">Join Our Mission</DialogTitle>
              </div>
              <DialogDescription className="text-muted-foreground">
                Fill out this form to partner with us and contribute to India's education.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" required className="bg-white/5 border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+91 9876543210" required className="bg-white/5 border-border" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email ID</Label>
                    <Input id="email" type="email" placeholder="john@example.com" required className="bg-white/5 border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Mumbai, Delhi, etc." required className="bg-white/5 border-border" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation / Business</Label>
                    <Input id="occupation" placeholder="Software Engineer" required className="bg-white/5 border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="education">Education Qualification</Label>
                    <Select required>
                      <SelectTrigger className="bg-white/5 border-border">
                        <SelectValue placeholder="Select qualification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10th">10th Pass</SelectItem>
                        <SelectItem value="12th">12th Pass</SelectItem>
                        <SelectItem value="diploma">Diploma</SelectItem>
                        <SelectItem value="graduate">Graduate (Bachelors)</SelectItem>
                        <SelectItem value="post-graduate">Post Graduate (Masters)</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  Donation Amount <span className="text-xs font-normal text-muted-foreground bg-black/30 px-2 py-0.5 rounded-full">Min ₹10 - Max ₹50,000</span>
                </h3>
                
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold">₹</span>
                  <Input 
                    type="number" 
                    value={donationAmount[0]} 
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val)) setDonationAmount([Math.min(Math.max(val, 10), 50000)]);
                    }}
                    className="text-xl font-bold bg-slate-50/80 dark:bg-black/40 border-purple-500/30 w-32 h-12"
                    min={10}
                    max={50000}
                  />
                </div>
                
                <div className="pt-4 pb-2">
                  <Slider 
                    value={donationAmount} 
                    onValueChange={setDonationAmount}
                    max={50000} 
                    min={10} 
                    step={10}
                    className="my-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>₹10</span>
                    <span>₹10,000</span>
                    <span>₹25,000</span>
                    <span>₹50,000</span>
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-4">
                 <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>Cancel</Button>
                 <div className="relative inline-flex h-10 overflow-visible rounded-full p-[2px] group">
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                    <Button type="submit" className="relative z-10 rounded-full bg-black hover:bg-neutral-900 border-none px-8 font-bold">
                      Submit Details
                    </Button>
                 </div>
              </DialogFooter>
            </form>
          </>
        </DialogContent>
      </Dialog>
      
      <SubmissionSuccessDialog 
        open={isSuccessOpen} 
        onOpenChange={setIsSuccessOpen}
        title="Welcome Aboard!"
        message="Thank you for joining our mission to revolutionize Indian education. We'll be in touch shortly."
      />
    </>
  );
}
