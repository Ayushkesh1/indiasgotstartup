import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Flag } from "lucide-react";
import { useSubmitReport } from "@/hooks/useArticleReports";

interface ReportArticleDialogProps {
  articleId: string;
}

export function ReportArticleDialog({ articleId }: ReportArticleDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const submitReport = useSubmitReport();

  const handleSubmit = () => {
    if (!reason) return;
    
    submitReport.mutate(
      { articleId, reason, description },
      {
        onSuccess: () => {
          setOpen(false);
          setReason("");
          setDescription("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Flag className="h-4 w-4 mr-2" />
          Report
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Article</DialogTitle>
          <DialogDescription>
            Help us maintain quality content. Select a reason for reporting this article.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Reason</Label>
            <RadioGroup value={reason} onValueChange={setReason} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="spam" id="spam" />
                <Label htmlFor="spam" className="font-normal cursor-pointer">
                  Spam or misleading
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="offensive" id="offensive" />
                <Label htmlFor="offensive" className="font-normal cursor-pointer">
                  Offensive or inappropriate
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="copyright" id="copyright" />
                <Label htmlFor="copyright" className="font-normal cursor-pointer">
                  Copyright violation
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="misinformation" id="misinformation" />
                <Label htmlFor="misinformation" className="font-normal cursor-pointer">
                  False or misleading information
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other" className="font-normal cursor-pointer">
                  Other
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="description">Additional details (optional)</Label>
            <Textarea
              id="description"
              placeholder="Provide more context about why you're reporting this article..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!reason || submitReport.isPending}
          >
            {submitReport.isPending ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
