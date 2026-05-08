import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SubmissionSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message?: string;
  icon?: React.ElementType;
  buttonText?: string;
}

export function SubmissionSuccessDialog({
  open,
  onOpenChange,
  title = "Success!",
  message = "Your details have been successfully submitted. We'll be in touch shortly.",
  icon: Icon = CheckCircle2,
  buttonText = "Close"
}: SubmissionSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-background/90 border-border text-foreground backdrop-blur-2xl p-0 overflow-hidden rounded-[2.5rem] shadow-2xl">
        <AnimatePresence>
          {open && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative p-10 flex flex-col items-center text-center"
            >
              {/* Background Glows */}
              <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-teal-500/10 blur-[80px] rounded-full pointer-events-none" />
              
              {/* Close Button Override */}
              <div className="absolute top-6 right-6 hidden">
                <X className="h-4 w-4" />
              </div>

              {/* Icon Container */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-3xl flex items-center justify-center border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                  <Icon className="h-12 w-12 text-emerald-400" />
                </div>
                {/* Orbital Rings decor */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-emerald-500/10 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-teal-500/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
              </div>

              {/* Content */}
              <h2 className="text-4xl font-black mb-4 tracking-tight bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 dark:from-white dark:via-emerald-100 dark:to-teal-200 bg-clip-text text-transparent">
                {title}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed font-medium mb-12 max-w-[320px]">
                {message}
              </p>

              {/* Action Button */}
              <div className="relative group w-full max-w-[240px]">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-80 transition-opacity duration-500" />
                <Button 
                  onClick={() => onOpenChange(false)}
                  className="relative w-full h-14 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-lg tracking-widest uppercase rounded-2xl border-none shadow-xl active:scale-95 transition-all"
                >
                  {buttonText}
                </Button>
              </div>

              {/* Decorative particles (simulated) */}
              <div className="absolute bottom-10 left-10 w-2 h-2 bg-emerald-400/30 rounded-full animate-pulse" />
              <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-teal-400/30 rounded-full animate-pulse delay-700" />
              <div className="absolute bottom-20 right-10 w-1 h-1 bg-white/20 rounded-full animate-pulse delay-1000" />
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
