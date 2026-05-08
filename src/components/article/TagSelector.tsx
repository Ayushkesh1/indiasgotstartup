// Simplified TagSelector without database dependencies
interface TagSelectorProps {
  articleId?: string;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagSelector = ({ articleId, selectedTags, onTagsChange }: TagSelectorProps) => {
  return null; // Removed for now
};

export default TagSelector;
