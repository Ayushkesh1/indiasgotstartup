import { useState, useRef, useEffect } from "react";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  "All": "bg-primary",
  "Fintech": "bg-emerald-500",
  "Tech": "bg-blue-500",
  "Blockchain": "bg-violet-500",
  "eCommerce": "bg-orange-500",
  "Government": "bg-indigo-500",
  "Edtech": "bg-pink-500",
  "Funding": "bg-amber-500",
  "Mobility": "bg-teal-500",
};

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const allCategories = ["All", ...categories];

  // Recalculate slider position and width whenever the selected category changes
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Slight delay to ensure DOM has completely rendered the buttons
    const timeout = setTimeout(() => {
      const buttons = Array.from(containerRef.current?.querySelectorAll("button") || []);
      const selectedBtn = buttons.find(btn => btn.dataset.category === selectedCategory);
      
      if (selectedBtn) {
        setPillStyle({
          left: selectedBtn.offsetLeft,
          width: selectedBtn.offsetWidth,
          opacity: 1
        });
      }
    }, 50);

    return () => clearTimeout(timeout);
  }, [selectedCategory, categories]);

  // Handle window resize dynamically adjusting the pill width
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const buttons = Array.from(containerRef.current.querySelectorAll("button"));
      const selectedBtn = buttons.find(btn => btn.dataset.category === selectedCategory);
      if (selectedBtn) {
        setPillStyle(prev => ({
          ...prev,
          left: selectedBtn.offsetLeft,
          width: selectedBtn.offsetWidth,
        }));
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedCategory]);

  const activeColorClass = CATEGORY_COLORS[selectedCategory] || "bg-primary";

  return (
    <div className="w-full relative">
      <div 
        className="relative flex gap-1 sm:gap-2 overflow-x-auto py-2 scrollbar-hide px-1" 
        ref={containerRef}
      >
        {/* Animated Fluid Pill Background */}
        <div 
          className={`absolute top-2 bottom-2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-sm z-0 ${activeColorClass}`}
          style={{ 
            left: `${pillStyle.left}px`, 
            width: `${pillStyle.width}px`,
            opacity: pillStyle.opacity
          }}
        />
        
        {allCategories.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              data-category={category}
              onClick={() => onCategoryChange(category)}
              className={`relative z-10 px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-colors duration-300 ${
                isSelected
                  ? "text-white"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {category === "All" ? "For you" : category}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
