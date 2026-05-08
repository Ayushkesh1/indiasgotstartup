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
import { PlusCircle, Image as ImageIcon, MapPin, AlignLeft, Target, ArrowLeft, Calendar, FileText, Heart, PenTool, Users } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SubmissionSuccessDialog } from "@/components/SubmissionSuccessDialog";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
        <title>Create an Event | India's Got Startup</title>
      </Helmet>

      {/* Ambient Lighting Background */}
      <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[600px] bg-amber-500/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />
      
      <Navbar />

      <main className="flex-1 relative z-10 w-full container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-12">
        <button 
          onClick={() => navigate("/events")}
          className="flex items-center text-muted-foreground hover:text-foreground dark:text-white transition-colors mb-8 group w-max"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Events
        </button>

        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-foreground dark:text-white leading-tight drop-shadow-lg mb-4">
            Host an <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 animate-gradient">Experience</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Design an engaging event and connect with founders, investors, and innovators across the ecosystem.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-border overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500"></div>
            <CardHeader className="pb-8 pt-10 px-8 border-b border-border">
              <CardTitle className="text-2xl flex items-center gap-2">
                <FileText className="w-6 h-6 text-amber-400" />
                Event Details
              </CardTitle>
              <CardDescription className="text-muted-foreground text-base">
                Provide the essential information to make your event stand out.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              
              {/* Image Upload */}
              <div className="space-y-3">
                <Label className="text-foreground/80 font-semibold flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-rose-400" /> Event Cover Image
                </Label>
                <div className="border-2 border-dashed border-border rounded-2xl p-8 hover:bg-white/5 transition-colors group relative overflow-hidden flex flex-col items-center justify-center min-h-[200px] cursor-pointer">
                   {selectedImage ? (
                     <div className="absolute inset-0 w-full h-full">
                       <img src={selectedImage} alt="Cover Preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="bg-black/80 px-4 py-2 rounded-full font-bold text-sm tracking-widest text-foreground dark:text-white">CHANGE IMAGE</span>
                       </div>
                     </div>
                   ) : (
                     <div className="text-center">
                       <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                         <ImageIcon className="w-8 h-8 text-rose-400" />
                       </div>
                       <p className="text-foreground/80 font-medium mb-1">Click to upload cover image</p>
                       <p className="text-muted-foreground text-xs">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                     </div>
                   )}
                   <input type="file" required={!selectedImage} accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                </div>
              </div>

              {/* Core Information */}
              <div className="space-y-3">
                <Label className="text-foreground/80 font-semibold flex items-center gap-2">
                  <AlignLeft className="w-4 h-4 text-orange-400" /> Event Heading
                </Label>
                <Input required placeholder="E.g., Global AI Summit 2026, Startup Founder Meetup..." className="bg-slate-50/80 dark:bg-black/40 border-border focus-visible:ring-orange-500/50 h-14 text-lg font-medium placeholder:text-zinc-600" />
              </div>

              <div className="space-y-3">
                <Label className="text-foreground/80 font-semibold flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-amber-400" /> Subheading & Description
                </Label>
                <Textarea 
                  required 
                  placeholder="Describe your event's agenda, key takeaways, and why people should attend..." 
                  className="bg-slate-50/80 dark:bg-black/40 border-border focus-visible:ring-amber-500/50 min-h-[140px] resize-y" 
                />
              </div>

              {/* Logistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Date Picker with Dial Animation */}
                <div className="space-y-3 group">
                  <Label className="text-foreground/80 font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" /> Event Date
                  </Label>
                  <div className="relative">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={`w-full justify-start text-left font-bold border border-cyan-500/30 bg-white/70 dark:bg-zinc-900/80 shadow-[0_0_15px_rgba(34,211,238,0.15)] hover:bg-neutral-800 transition-all duration-300 h-12 text-foreground/80 hover:text-foreground dark:text-white ${!eventDate && "text-muted-foreground"}`}
                        >
                          <Calendar className="mr-3 h-5 w-5 text-cyan-400" />
                          {eventDate ? format(eventDate, "PPP") : <span>Date: All</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-0 border-cyan-500/30 bg-neutral-900 overflow-hidden rounded-xl shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                        <CalendarUI
                          mode="single"
                          selected={eventDate}
                          onSelect={setEventDate}
                          initialFocus
                          className="text-foreground dark:text-white bg-gradient-to-b from-neutral-900 to-neutral-950 p-3"
                          classNames={{
                            day_selected: "bg-gradient-to-r from-cyan-500 to-purple-500 text-foreground dark:text-white shadow-[0_0_10px_rgba(34,211,238,0.5)] font-bold",
                            day_today: "bg-purple-500/20 text-purple-300 border border-purple-500/50",
                            cell: "h-9 w-9 text-center text-sm p-0 flex items-center justify-center",
                            nav_button: "border border-border hover:bg-white/10 p-1 rounded-md transition-colors"
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    {/* Hidden input to ensure HTML form validation continues to work */}
                    <input type="hidden" name="eventDate" required value={eventDate ? eventDate.toISOString() : ""} />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-foreground/80 font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400" /> Format
                  </Label>
                  <Select required>
                    <SelectTrigger className="bg-slate-50/80 dark:bg-black/40 border-border h-12 focus:ring-cyan-500/50">
                      <SelectValue placeholder="Select Format" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-border">
                      <SelectItem value="Offline">Offline / In-Person</SelectItem>
                      <SelectItem value="Online">Online / Virtual</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Targets & Categories */}
              <div className="space-y-6 border-t border-border pt-8 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-foreground/80 font-semibold flex items-center gap-2">
                      <Target className="w-4 h-4 text-purple-400" /> Field of Event / Sector
                    </Label>
                    <Input required placeholder="E.g., SaaS, FinTech, DeepTech, Marketing..." className="bg-slate-50/80 dark:bg-black/40 border-border focus-visible:ring-purple-500/50 h-12" />
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-foreground/80 font-semibold flex items-center gap-2">
                      <Users className="w-4 h-4 text-pink-400" /> Specific Target Audience
                    </Label>
                    <Input required placeholder="E.g., Early-stage Founders, Investors, Students..." className="bg-slate-50/80 dark:bg-black/40 border-border focus-visible:ring-pink-500/50 h-12" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-foreground/80 font-semibold flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-400" /> Beneficiaries <span className="text-muted-foreground font-normal">(Optional)</span>
                  </Label>
                  <Input placeholder="E.g., Underrepresented communities, non-profits..." className="bg-slate-50/80 dark:bg-black/40 border-border focus-visible:ring-rose-500/50 h-12" />
                </div>
              </div>

              {/* Special Note */}
              <div className="space-y-3 border-t border-border pt-8 mt-8">
                <Label className="text-foreground/80 font-semibold flex items-center gap-2">
                   <PenTool className="w-4 h-4 text-muted-foreground" /> Special Note by Creators <span className="text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <Textarea 
                  placeholder="Any special instructions for attendees or personal message from the host..." 
                  className="bg-slate-50/80 dark:bg-black/40 border-border focus-visible:ring-zinc-500/50 min-h-[100px] resize-y" 
                />
              </div>

            </CardContent>
            
            <div className="p-8 border-t border-border bg-black/20 flex items-center justify-end">
               <Button type="button" variant="ghost" className="mr-4 text-muted-foreground hover:text-foreground dark:text-white hover:bg-white/5" onClick={() => navigate("/events")}>
                 Cancel
               </Button>
               <Button 
                type="submit" 
                disabled={isSubmitting}
                className="h-12 px-8 font-bold tracking-widest uppercase bg-gradient-to-r from-amber-600 to-rose-500 hover:from-amber-500 hover:to-rose-400 text-foreground dark:text-white rounded-full shadow-[0_0_20px_rgba(251,146,60,0.4)] transition-all"
               >
                 {isSubmitting ? (
                   <span className="flex items-center gap-2">Publishing Event...</span>
                 ) : (
                   <span className="flex items-center gap-2"><PlusCircle className="w-4 h-4" /> Publish Event</span>
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
          if (!open) navigate("/events");
        }}
        title="Event Submitted!"
        message="Thank you! Your event has been submitted successfully and will be live after review."
      />
    </div>
  );
};

export default CreateEvent;
