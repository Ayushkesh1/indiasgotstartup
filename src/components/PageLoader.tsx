import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background pointer-events-none">
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.15),transparent_50%)]"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        <div className="relative flex items-center justify-center">
           <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse rounded-full"></div>
           <Loader2 className="w-12 h-12 text-primary animate-[spin_1.5s_linear_infinite] drop-shadow-[0_0_15px_rgba(var(--primary),0.8)]" />
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-brand font-black uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary animate-gradient bg-[length:200%_auto]">
            Synthesizing
          </h2>
          <div className="flex gap-1">
             {[0, 1, 2].map((i) => (
                <motion.div 
                   key={i}
                   initial={{ opacity: 0.2, y: 0 }}
                   animate={{ opacity: 1, y: -4 }}
                   transition={{ 
                      repeat: Infinity, 
                      repeatType: "reverse", 
                      duration: 0.5, 
                      delay: i * 0.15 
                   }}
                   className="w-1.5 h-1.5 rounded-full bg-primary"
                />
             ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
