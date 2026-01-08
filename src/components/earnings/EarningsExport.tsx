import { useState } from "react";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Earning } from "@/hooks/useEarnings";
import { format } from "date-fns";
import { toast } from "sonner";

interface EarningsExportProps {
  earnings: Earning[];
  dateRange?: { from?: Date; to?: Date };
}

export function EarningsExport({ earnings, dateRange }: EarningsExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const generateCSV = () => {
    const headers = ["Date", "Description", "Type", "Amount", "Status", "Article"];
    const rows = earnings.map((e) => [
      format(new Date(e.created_at), "yyyy-MM-dd HH:mm:ss"),
      e.description || "",
      e.type,
      Number(e.amount).toFixed(2),
      e.status,
      e.article_id || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    return csvContent;
  };

  const generatePDFContent = () => {
    const totalEarnings = earnings.reduce((sum, e) => sum + Number(e.amount), 0);
    const pendingEarnings = earnings
      .filter((e) => e.status === "pending")
      .reduce((sum, e) => sum + Number(e.amount), 0);
    const paidEarnings = earnings
      .filter((e) => e.status === "paid")
      .reduce((sum, e) => sum + Number(e.amount), 0);

    const dateRangeText = dateRange?.from
      ? `${format(dateRange.from, "MMM dd, yyyy")} - ${format(dateRange.to || dateRange.from, "MMM dd, yyyy")}`
      : "All Time";

    return `
<!DOCTYPE html>
<html>
<head>
  <title>Earnings Report</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
    h1 { color: #1a1a1a; border-bottom: 2px solid #eee; padding-bottom: 10px; }
    .summary { display: flex; gap: 20px; margin: 20px 0; }
    .summary-card { background: #f9f9f9; padding: 15px 20px; border-radius: 8px; flex: 1; }
    .summary-card h3 { margin: 0 0 5px 0; font-size: 12px; color: #666; text-transform: uppercase; }
    .summary-card p { margin: 0; font-size: 24px; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f5f5f5; font-weight: 600; }
    .status-paid { color: #22c55e; }
    .status-pending { color: #f59e0b; }
    .footer { margin-top: 40px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 20px; }
  </style>
</head>
<body>
  <h1>Earnings Report</h1>
  <p>Generated on ${format(new Date(), "MMMM dd, yyyy 'at' h:mm a")}</p>
  <p>Period: ${dateRangeText}</p>
  
  <div class="summary">
    <div class="summary-card">
      <h3>Total Earnings</h3>
      <p>$${totalEarnings.toFixed(2)}</p>
    </div>
    <div class="summary-card">
      <h3>Pending</h3>
      <p>$${pendingEarnings.toFixed(2)}</p>
    </div>
    <div class="summary-card">
      <h3>Paid Out</h3>
      <p>$${paidEarnings.toFixed(2)}</p>
    </div>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Description</th>
        <th>Type</th>
        <th>Amount</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${earnings
        .map(
          (e) => `
        <tr>
          <td>${format(new Date(e.created_at), "MMM dd, yyyy")}</td>
          <td>${e.description || "-"}</td>
          <td>${e.type}</td>
          <td>$${Number(e.amount).toFixed(2)}</td>
          <td class="status-${e.status}">${e.status.charAt(0).toUpperCase() + e.status.slice(1)}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>
  
  <div class="footer">
    <p>This report is for tax and record-keeping purposes.</p>
    <p>Total transactions: ${earnings.length}</p>
  </div>
</body>
</html>
    `;
  };

  const downloadCSV = () => {
    setIsExporting(true);
    try {
      const csv = generateCSV();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `earnings-report-${format(new Date(), "yyyy-MM-dd")}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV exported successfully!");
    } catch (error) {
      toast.error("Failed to export CSV");
    } finally {
      setIsExporting(false);
    }
  };

  const downloadPDF = () => {
    setIsExporting(true);
    try {
      const htmlContent = generatePDFContent();
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 250);
        toast.success("PDF ready for printing/saving!");
      } else {
        toast.error("Please allow popups to generate PDF");
      }
    } catch (error) {
      toast.error("Failed to generate PDF");
    } finally {
      setIsExporting(false);
    }
  };

  if (earnings.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={downloadCSV}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Download CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={downloadPDF}>
          <FileText className="h-4 w-4 mr-2" />
          Download PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
