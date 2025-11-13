import { useTags } from "@/hooks/useTags";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tag } from "lucide-react";

interface TagFilterProps {
  selectedTag: string | null;
  onTagChange: (tag: string | null) => void;
}

export default function TagFilter({ selectedTag, onTagChange }: TagFilterProps) {
  const { data: tags, isLoading } = useTags();

  if (isLoading || !tags || tags.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Tag className="h-4 w-4" />
        Filter by Tag
      </div>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-2">
          <Badge
            variant={selectedTag === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onTagChange(null)}
          >
            All
          </Badge>
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              variant={selectedTag === tag.slug ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onTagChange(tag.slug)}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
