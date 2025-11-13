interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="border-b border-border bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6 overflow-x-auto py-4 scrollbar-hide">
          <button
            onClick={() => onCategoryChange("All")}
            className={`text-sm whitespace-nowrap pb-2 border-b-2 transition-colors ${
              selectedCategory === "All"
                ? "border-foreground text-foreground font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            For you
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`text-sm whitespace-nowrap pb-2 border-b-2 transition-colors ${
                selectedCategory === category
                  ? "border-foreground text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
