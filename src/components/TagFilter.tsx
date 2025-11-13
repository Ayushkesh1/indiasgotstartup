// Simplified TagFilter without database dependencies
interface TagFilterProps {
  selectedTag: string | null;
  onTagChange: (tag: string | null) => void;
}

const TagFilter = ({ selectedTag, onTagChange }: TagFilterProps) => {
  return null; // Removed for now
};

export default TagFilter;
