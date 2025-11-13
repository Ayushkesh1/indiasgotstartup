import { useTags } from "@/hooks/useTags";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

interface TagFilterProps {
  selectedTag: string | null;
  onTagChange: (tag: string | null) => void;
}

const TagFilter = ({ selectedTag, onTagChange }: TagFilterProps) => {
  const { data: tags, isLoading } = useTags();

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
    );
  }

  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {selectedTag && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onTagChange(null)}
          className="rounded-full gap-1 shrink-0"
        >
          <X className="h-3 w-3" />
          Clear
        </Button>
      )}
      {tags.slice(0, 15).map((tag) => (
        <Button
          key={tag.id}
          variant={selectedTag === tag.slug ? "default" : "outline"}
          size="sm"
          onClick={() => onTagChange(tag.slug)}
          className="rounded-full shrink-0"
        >
          #{tag.name}
        </Button>
      ))}
    </div>
  );
};

export default TagFilter;
