import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { List, ChevronRight, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface EditorTableOfContentsProps {
  content: string;
  onNavigate?: (id: string) => void;
}

export const EditorTableOfContents = ({ content, onNavigate }: EditorTableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Parse headings from HTML content
  const headings = useMemo(() => {
    if (!content) return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const headingElements = doc.querySelectorAll("h1, h2, h3");
    
    const items: TOCItem[] = [];
    headingElements.forEach((el, index) => {
      const level = parseInt(el.tagName.charAt(1));
      const text = el.textContent?.trim() || "";
      if (text) {
        items.push({
          id: `heading-${index}`,
          text,
          level,
        });
      }
    });
    
    return items;
  }, [content]);

  const handleClick = (heading: TOCItem) => {
    setActiveId(heading.id);
    onNavigate?.(heading.id);
    setIsOpen(false);
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 fixed bottom-6 right-6 z-40 shadow-lg bg-background/95 backdrop-blur-sm"
        >
          <List className="h-4 w-4" />
          Contents
          <span className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full">
            {headings.length}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 p-0">
        <SheetHeader className="p-6 pb-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <Hash className="h-5 w-5 text-primary" />
            Table of Contents
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)]">
          <nav className="p-4">
            <ul className="space-y-1">
              {headings.map((heading, index) => (
                <li key={heading.id}>
                  <button
                    onClick={() => handleClick(heading)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 group",
                      heading.level === 1 && "font-semibold",
                      heading.level === 2 && "pl-6 text-muted-foreground",
                      heading.level === 3 && "pl-9 text-muted-foreground text-xs",
                      activeId === heading.id
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-accent"
                    )}
                  >
                    <ChevronRight 
                      className={cn(
                        "h-3 w-3 transition-transform",
                        activeId === heading.id && "text-primary",
                        "group-hover:translate-x-0.5"
                      )} 
                    />
                    <span className="truncate">{heading.text}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default EditorTableOfContents;