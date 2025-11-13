import { useState } from "react";
import { useTags, useArticleTags, useCreateTag, useAddTagToArticle, useRemoveTagFromArticle } from "@/hooks/useTags";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TagSelectorProps {
  articleId: string;
}

export default function TagSelector({ articleId }: TagSelectorProps) {
  const [newTagName, setNewTagName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { data: allTags } = useTags();
  const { data: articleTags } = useArticleTags(articleId);
  const createTag = useCreateTag();
  const addTag = useAddTagToArticle();
  const removeTag = useRemoveTagFromArticle();

  const selectedTagIds = articleTags?.map((at) => at.tag_id) || [];
  const availableTags = allTags?.filter((tag) => !selectedTagIds.includes(tag.id)) || [];

  const handleCreateAndAddTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const newTag = await createTag.mutateAsync({ name: newTagName.trim() });
      await addTag.mutateAsync({ articleId, tagId: newTag.id });
      setNewTagName("");
      toast.success("Tag added");
    } catch (error) {
      toast.error("Failed to add tag");
    }
  };

  const handleAddExistingTag = async (tagId: string) => {
    try {
      await addTag.mutateAsync({ articleId, tagId });
      toast.success("Tag added");
    } catch (error) {
      toast.error("Failed to add tag");
    }
  };

  const handleRemoveTag = async (tagId: string) => {
    try {
      await removeTag.mutateAsync({ articleId, tagId });
      toast.success("Tag removed");
    } catch (error) {
      toast.error("Failed to remove tag");
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Tags</label>
      
      <div className="flex flex-wrap gap-2">
        {articleTags?.map((articleTag) => (
          <Badge key={articleTag.id} variant="secondary" className="gap-1">
            {articleTag.tags.name}
            <button
              type="button"
              onClick={() => handleRemoveTag(articleTag.tag_id)}
              className="ml-1 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" size="sm">
              <Plus className="h-3 w-3 mr-1" />
              Add Tag
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Create New Tag</label>
                <div className="flex gap-2">
                  <Input
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="Enter tag name"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleCreateAndAddTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleCreateAndAddTag}
                    disabled={!newTagName.trim() || createTag.isPending}
                  >
                    Create
                  </Button>
                </div>
              </div>

              {availableTags.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Or Select Existing</label>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => handleAddExistingTag(tag.id)}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
