import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ReactNode, useEffect } from "react";

export const PageTransition = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
      transition={{ 
        duration: 0.4, 
        ease: [0.22, 1, 0.36, 1] // Custom fluid ease
      }}
      className="w-full flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
};
