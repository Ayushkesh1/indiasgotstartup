import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import { NewsletterFooter } from "@/components/NewsletterFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, Link as LinkIcon, Building2, AlignLeft, Target, GraduationCap, ArrowLeft, Calendar, FileText } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SubmissionSuccessDialog } from "@/components/SubmissionSuccessDialog";

const CreateGrant = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccessOpen(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background relative selection:bg-purple-500/30 overflow-hidden text-foreground flex flex-col">
      <Helmet>
        <title>Post a Grant | India's Got Startup</title>
      </Helmet>

      {/* Ambient Lighting Background */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[600px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      
      <Navbar />

      <main className="flex-1 relative z-10 w-full container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-12">
        <button 
          onClick={() => navigate("/grants")}
          className="flex items-center text-muted-foreground hover:text-foreground dark:text-white transition-colors mb-8 group w-max"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Grants
        </button>

        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-foreground dark:text-white leading-tight drop-shadow-lg mb-4">
            Post an <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-gradient">Opportunity</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ignite innovation by sharing your grant, seed funding, or acceleration program with thousands of promising Indian startups.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-border overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500"></div>
            <CardHeader className="pb-8 pt-10 px-8 border-b border-border">
              <CardTitle className="text-2xl flex items-center gap-2">
                <FileText className="w-6 h-6 text-cyan-400" />
                Grant Details
              </CardTitle>
              <CardDescription className="text-muted-foreground text-base">
                Provide comprehensive information so the right startups can find you.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              
              {/* Organization Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 flex-1">
                  <Label className="text-foreground/80 font-semibold flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-purple-400" /> Organization Name
                  </Label>
                  <Input required placeholder="E.g., DPIIT, Y Combinator..." className="bg-slate-50/80 dark:bg-black/40 border-border focus-visible:ring-purple-500/50 h-12" />
                </div>
                <div className="space-y-3 flex-1">
                  <Label className="text-foreground/80 font-semibold flex items-center gap-2">
                    <Target className="w-4 h-4 text-cyan-400" /> Sector of Organization
                  </Label>
                  <Input required placeholder="E.g., Government, VC, Corporate..." className="bg-slate-50/80 dark:bg-black/40 border-border focus-visible:ring-cyan-500/50 h-12" />
                </div>
              </div>

              {/* Core Information */}
              <div className="space-y-3">
                <Label className="text-foreground/80 font-semibold flex items-center gap-2">
                  <AlignLeft className="w-4 h-4 text-pink-400" /> Grant Title
                </Label>
                <Input required placeholder="Give your program a catchy, clear name" className="bg-slate-50/80 dark:bg-black/40 border-border focus-visible:ring-pink-500/50 h-12" />
              </div>

              <div className="space-y-3">
                <Label className="text-foreground/80 font-semibold flex items-center gap-2">
                  <AlignLeft className="w-4 h-4 text-purple-400" /> Short Description
                </Label>
                <Textarea 
                  required 
                  placeholder="Describe the main objective, total corpus, and what you are looking for..." 
                  className="bg-slate-50/80 dark:bg-black/40 border-border focus-visible:ring-purple-500/50 min-h-[120px] resize-y" 
                />
              </div>

              {/* Logistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Label className="text-foreground/80 font-semibold flex items-center gap-2">
                    <Target className="w-4 h-4 text-cyan-400" /> Category
                  </Label>
                  <Select required>
                    <SelectTrigger className="bg-slate-50/80 dark:bg-black/40 border-border h-12 focus:ring-cyan-500/50">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-border">
                      <SelectItem value="Grant">Grant</SelectItem>
                      <SelectItem value="Seed Funding">Seed Funding</SelectItem>
                      <SelectItem value="Accelerator">Accelerator</SelectItem>
                      <SelectItem value="Incubator">Incubator</SelectItem>
                      <SelectItem value="Contest">Contest</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-foreground/80 font-semibold flex items-center gap-2">
                    <Target className="w-4 h-4 text-pink-400" /> Funding Size
                  </Label>
                  <Input required placeholder="E.g., ₹50 Lakhs, $100k..." className="bg-slate-50/80 dark:bg-black/40 border-border focus-visible:ring-pink-500/50 h-12" />
                </div>

                <div className="space-y-3 group">
                  <Label className="text-foreground/80 font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" /> Deadline
                  </Label>
                  <div className="relative">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={`w-full justify-start text-left font-bold border border-purple-500/30 bg-white/70 dark:bg-zinc-900/80 shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:bg-neutral-800 transition-all duration-300 h-12 text-foreground/80 hover:text-foreground dark:text-white ${!deadlineDate && "text-muted-foreground"}`}
                        >
                          <Calendar className="mr-3 h-5 w-5 text-purple-400" />
                          {deadlineDate ? format(deadlineDate, "PPP") : <span>Select Deadline</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-0 border-purple-500/30 bg-neutral-900 overflow-hidden rounded-xl shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                        <CalendarUI
                          mode="single"
                          selected={deadlineDate}
                          onSelect={setDeadlineDate}
                          initialFocus
                          className="text-foreground dark:text-white bg-gradient-to-b from-neutral-900 to-neutral-950 p-3"
                          classNames={{
                            day_selected: "bg-gradient-to-r from-purple-500 to-pink-500 text-foreground dark:text-white shadow-[0_0_10px_rgba(168,85,247,0.5)] font-bold",
                            day_today: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50",
                            cell: "h-9 w-9 text-center text-sm p-0 flex items-center justify-center",
                            nav_button: "border border-border hover:bg-white/10 p-1 rounded-md transition-colors"
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <input type="hidden" name="deadline" required value={deadlineDate ? deadlineDate.toISOString() : ""} />
                  </div>
                </div>
              </div>

              {/* Requirements & Links */}
              <div className="space-y-3 border-t border-border pt-8 mt-8">
                <Label className="text-foreground/80 font-semibold flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-cyan-400" /> Eligibility Criteria
                </Label>
                <Textarea 
                  required 
                  placeholder="Who can apply? E.g., Revenue generating, Age of startup, specific sectors..." 
                  className="bg-slate-50/80 dark:bg-black/40 border-border focus-visible:ring-cyan-500/50 min-h-[100px] resize-y" 
                />
              </div>

              <div className="space-y-3">
                <Label className="text-foreground/80 font-semibold flex items-center gap-2">
                   <Target className="w-4 h-4 text-pink-400" /> Target Audience / Preference (Optional)
                </Label>
                <Input placeholder="E.g., Women Entrepreneurs, Tier-2 City Startups, DeepTech..." className="bg-slate-50/80 dark:bg-black/40 border-border focus-visible:ring-pink-500/50 h-12" />
              </div>

              <div className="space-y-3">
                <Label className="text-foreground/80 font-semibold flex items-center gap-2">
                   <LinkIcon className="w-4 h-4 text-purple-400" /> Application Link
                </Label>
                <Input required type="url" placeholder="https://..." className="bg-slate-50/80 dark:bg-black/40 border-border focus-visible:ring-purple-500/50 h-12" />
                <p className="text-xs text-muted-foreground ml-1">The URL where startups will actually submit their applications.</p>
              </div>

            </CardContent>
            
            <div className="p-8 border-t border-border bg-black/20 flex items-center justify-end">
               <Button type="button" variant="ghost" className="mr-4 text-muted-foreground hover:text-foreground dark:text-white hover:bg-white/5" onClick={() => navigate("/grants")}>
                 Cancel
               </Button>
               <Button 
                type="submit" 
                disabled={isSubmitting}
                className="h-12 px-8 font-bold tracking-widest uppercase bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-foreground dark:text-white rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
               >
                 {isSubmitting ? (
                   <span className="flex items-center gap-2">Publishing...</span>
                 ) : (
                   <span className="flex items-center gap-2"><PlusCircle className="w-4 h-4" /> Publish Grant</span>
                 )}
               </Button>
            </div>
          </Card>
        </form>
      </main>

      <NewsletterFooter />

      <SubmissionSuccessDialog 
        open={isSuccessOpen} 
        onOpenChange={(open) => {
          setIsSuccessOpen(open);
          if (!open) navigate("/grants");
        }}
        title="Grant Submitted!"
        message="Thank you! Your grant has been submitted successfully. It will be reviewed and published soon."
      />
    </div>
  );
};

export default CreateGrant;
