import { Input } from "@/components/ui/input";
import { forwardRef } from "react";

interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: string;
  onChange?: (date: string) => void;
  min?: string;
}

// Convert YYYY-MM-DD to DD/MM/YYYY for display
const formatDateForDisplay = (isoDate: string): string => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
};

export const DateInputDD_MM_YYYY = forwardRef<HTMLInputElement, DateInputProps>(
  ({ value, onChange, className, min, ...props }, ref) => {
    const displayValue = value ? formatDateForDisplay(value) : '';

    const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const isoDate = e.target.value;
      onChange?.(isoDate);
    };

    return (
      <div className="relative">
        <Input
          {...props}
          ref={ref}
          type="date"
          value={value || ''}
          onChange={handleDateInputChange}
          min={min}
          className={`date-input ${className || ''}`}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <span className="text-xs text-gray-500 bg-white px-1 rounded">
            {displayValue || 'dd/mm/yyyy'}
          </span>
        </div>
      </div>
    );
  }
);

DateInputDD_MM_YYYY.displayName = 'DateInputDD_MM_YYYY';