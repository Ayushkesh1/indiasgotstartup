import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends ButtonProps {
  gradientVariant?: "pink-cyan" | "purple-blue" | "orange-red" | "emerald-teal" | "gold";
}

export const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, gradientVariant = "pink-cyan", children, onClick, asChild, ...props }, ref) => {
    
    // Default pink-cyan (original Join Our Mission style)
    let outerGradient = "from-[#ff0080] via-[#7928ca] to-[#00aaff]";
    let innerSpinGradient = "bg-[conic-gradient(from_0deg,#ff0080,#7928ca,#00aaff,#7928ca,#ff0080)]";

    if (gradientVariant === "purple-blue") {
      outerGradient = "from-purple-600 via-indigo-500 to-blue-500";
      innerSpinGradient = "bg-[conic-gradient(from_0deg,#9333ea,#6366f1,#3b82f6,#6366f1,#9333ea)]";
    } else if (gradientVariant === "orange-red") {
      outerGradient = "from-red-500 via-orange-500 to-yellow-500";
      innerSpinGradient = "bg-[conic-gradient(from_0deg,#ef4444,#f97316,#eab308,#f97316,#ef4444)]";
    } else if (gradientVariant === "emerald-teal") {
      outerGradient = "from-emerald-500 via-teal-500 to-cyan-500";
      innerSpinGradient = "bg-[conic-gradient(from_0deg,#10b981,#14b8a6,#06b6d4,#14b8a6,#10b981)]";
    } else if (gradientVariant === "gold") {
      outerGradient = "from-amber-500 via-yellow-400 to-amber-600";
      innerSpinGradient = "bg-[conic-gradient(from_0deg,#f59e0b,#facc15,#d97706,#facc15,#f59e0b)]";
    }

    return (
      <div className="relative inline-flex h-12 sm:h-14 overflow-visible rounded-full p-[2px] group shadow-2xl w-fit">
        <span className={cn(
          "absolute inset-0 bg-gradient-to-r rounded-full blur-xl opacity-30 group-hover:opacity-100 transition-opacity duration-700 z-0",
          outerGradient
        )} />
        <div className="absolute inset-0 overflow-hidden rounded-full z-10">
          <span className={cn(
            "absolute inset-[-1000%] animate-[spin_20s_linear_infinite]",
            innerSpinGradient
          )} />
        </div>
        <Button 
          ref={ref}
          className={cn(
            "relative z-20 inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black px-10 py-0 text-sm sm:text-[15px] font-bold text-foreground dark:text-white uppercase tracking-widest transition-all hover:bg-neutral-900 border-none outline-none ring-0 gap-2",
            className
          )} 
          onClick={onClick}
          asChild={asChild}
          {...props}
        >
          {children}
        </Button>
      </div>
    );
  }
);

GradientButton.displayName = "GradientButton";
