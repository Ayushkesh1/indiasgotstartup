import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

export interface EarningsFilterState {
  dateRange: DateRange | undefined;
  status: string;
}

interface EarningsFiltersProps {
  filters: EarningsFilterState;
  onFiltersChange: (filters: EarningsFilterState) => void;
}

export function EarningsFilters({ filters, onFiltersChange }: EarningsFiltersProps) {
  const hasActiveFilters = filters.dateRange?.from || filters.status !== "all";

  const clearFilters = () => {
    onFiltersChange({
      dateRange: undefined,
      status: "all",
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-card border border-border">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Filter className="h-4 w-4" />
        Filters
      </div>

      {/* Date Range Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              !filters.dateRange?.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {filters.dateRange?.from ? (
              filters.dateRange.to ? (
                <>
                  {format(filters.dateRange.from, "LLL dd")} -{" "}
                  {format(filters.dateRange.to, "LLL dd, yyyy")}
                </>
              ) : (
                format(filters.dateRange.from, "LLL dd, yyyy")
              )
            ) : (
              "Date Range"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={filters.dateRange?.from}
            selected={filters.dateRange}
            onSelect={(range) =>
              onFiltersChange({ ...filters, dateRange: range })
            }
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {/* Status Filter */}
      <Select
        value={filters.status}
        onValueChange={(status) => onFiltersChange({ ...filters, status })}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
