import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TranslateButtonProps {
  content: string;
  onTranslate: (translatedContent: string, language: string) => void;
}

const languages = [
  { code: 'es', name: 'Spanish', short: 'ES', colorClass: 'focus:!bg-red-500/20 focus:!text-red-400 focus:border-red-500/50 text-foreground/80', iconColor: 'text-red-500' },
  { code: 'fr', name: 'French', short: 'FR', colorClass: 'focus:!bg-blue-500/20 focus:!text-blue-400 focus:border-blue-500/50 text-foreground/80', iconColor: 'text-blue-500' },
  { code: 'de', name: 'German', short: 'DE', colorClass: 'focus:!bg-amber-500/20 focus:!text-amber-400 focus:border-amber-500/50 text-foreground/80', iconColor: 'text-amber-500' },
  { code: 'it', name: 'Italian', short: 'IT', colorClass: 'focus:!bg-green-500/20 focus:!text-green-400 focus:border-green-500/50 text-foreground/80', iconColor: 'text-green-500' },
  { code: 'pt', name: 'Portuguese', short: 'PT', colorClass: 'focus:!bg-emerald-500/20 focus:!text-emerald-400 focus:border-emerald-500/50 text-foreground/80', iconColor: 'text-emerald-500' },
  { code: 'ja', name: 'Japanese', short: 'JA', colorClass: 'focus:!bg-rose-500/20 focus:!text-rose-400 focus:border-rose-500/50 text-foreground/80', iconColor: 'text-rose-500' },
  { code: 'ko', name: 'Korean', short: 'KO', colorClass: 'focus:!bg-indigo-500/20 focus:!text-indigo-400 focus:border-indigo-500/50 text-foreground/80', iconColor: 'text-indigo-500' },
  { code: 'zh', name: 'Chinese', short: 'ZH', colorClass: 'focus:!bg-red-600/20 focus:!text-red-500 focus:border-red-600/50 text-foreground/80', iconColor: 'text-red-600' },
  { code: 'ar', name: 'Arabic', short: 'AR', colorClass: 'focus:!bg-teal-500/20 focus:!text-teal-400 focus:border-teal-500/50 text-foreground/80', iconColor: 'text-teal-500' },
  { code: 'hi', name: 'Hindi', short: 'HI', colorClass: 'focus:!bg-orange-500/20 focus:!text-orange-400 focus:border-orange-500/50 text-foreground/80', iconColor: 'text-orange-500' },
  { code: 'ru', name: 'Russian', short: 'RU', colorClass: 'focus:!bg-cyan-500/20 focus:!text-cyan-400 focus:border-cyan-500/50 text-foreground/80', iconColor: 'text-cyan-500' },
];

const TranslateButton = ({ content, onTranslate }: TranslateButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleTranslate = async (targetLanguage: string, languageName: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('translate-article', {
        body: { content, targetLanguage }
      });

      if (error) throw error;

      if (data.error) throw new Error(data.error);

      onTranslate(data.translatedContent, languageName);
      toast({
        title: "Translation complete!",
        description: `Article translated to ${languageName}`,
      });
    } catch (error: any) {
      console.error("Translation error:", error);
      toast({
        title: "Translation failed",
        description: error.message || "Failed to translate article",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative inline-flex h-10 overflow-visible rounded-full p-[2px] group cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all">
          <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-md opacity-30 group-hover:opacity-100 transition-opacity duration-700 z-0" />
          <div className="absolute inset-0 overflow-hidden rounded-full z-10">
            <span className="absolute inset-[-1000%] animate-[spin_20s_linear_infinite] bg-[conic-gradient(from_0deg,#ff0080,#7928ca,#00aaff,#7928ca,#ff0080)]" />
          </div>
          <Button variant="outline" size="sm" disabled={loading} className="relative z-20 h-full w-full bg-black text-foreground dark:text-white hover:bg-neutral-900 border-none rounded-full gap-2 px-6 text-[13px] uppercase tracking-[0.1em] font-black">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
            ) : (
              <Globe className="h-4 w-4 text-cyan-400" />
            )}
            Translate
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-2 bg-background/95 backdrop-blur-2xl border border-border shadow-[0_0_30px_rgba(0,0,0,0.8)] animate-in slide-in-from-top-2 zoom-in-95 duration-200">
        <div className="px-3 py-2 mb-2 border-b border-border flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Select Language</span>
          <Globe className="w-3 h-3 text-muted-foreground" />
        </div>
        <div className="grid grid-cols-1 gap-1 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleTranslate(lang.code, lang.name)}
              disabled={loading}
              className={`gap-3 cursor-pointer transition-all duration-300 rounded-lg px-3 py-2 border border-transparent outline-none ${lang.colorClass}`}
            >
              <div className="relative flex items-center justify-center w-8 h-6 bg-zinc-900 rounded shadow-inner border border-border overflow-hidden group-focus/item:border-transparent">
                <span className={`text-[10px] font-black translate-y-[1px] ${lang.iconColor}`}>{lang.short}</span>
              </div>
              <span className="font-bold tracking-wide">{lang.name}</span>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TranslateButton;
