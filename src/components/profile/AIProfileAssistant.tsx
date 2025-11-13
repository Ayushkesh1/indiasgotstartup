import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AIProfileAssistantProps {
  currentBio: string;
  onApply: (newBio: string) => void;
}

const AIProfileAssistant = ({ currentBio, onApply }: AIProfileAssistantProps) => {
  const [input, setInput] = useState(currentBio);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleAIAction = async (action: "refine" | "expand" | "shorten") => {
    if (!input.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some text to work with",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('profile-assistant', {
        body: { action, text: input }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data.text);
      toast({
        title: "Success!",
        description: "Your bio has been refined by AI",
      });
    } catch (error: any) {
      console.error("AI Assistant error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process your request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    onApply(result);
    setOpen(false);
    toast({
      title: "Bio updated",
      description: "Your profile bio has been updated",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Sparkles className="h-4 w-4" />
          AI Assistant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            AI Profile Assistant
          </DialogTitle>
          <CardDescription>
            Let AI help you craft the perfect professional bio
          </CardDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Your Current Bio</label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your bio or key points about yourself..."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => handleAIAction("refine")}
              disabled={loading}
              size="sm"
              variant="outline"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Refine
            </Button>
            <Button
              onClick={() => handleAIAction("expand")}
              disabled={loading}
              size="sm"
              variant="outline"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Expand
            </Button>
            <Button
              onClick={() => handleAIAction("shorten")}
              disabled={loading}
              size="sm"
              variant="outline"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Shorten
            </Button>
          </div>

          {result && (
            <Card className="gradient-card">
              <CardHeader>
                <CardTitle className="text-lg">AI Suggestion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/90 mb-4">{result}</p>
                <Button onClick={handleApply} className="w-full gradient-primary">
                  Apply This Bio
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIProfileAssistant;
