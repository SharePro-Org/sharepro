import * as React from "react";
import { cn } from "@/lib/utils";
import { FiChevronDown } from "react-icons/fi";

export interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  className?: string;
  placeholder?: string;
  value?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, className, placeholder = "Select an option", value = "", ...props }, ref) => {
    // If value is empty, add text-gray5; else, text-gray-900 (default)
    const isPlaceholder = value === "" || value === undefined;

    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            "appearance-none w-full h-[55px] rounded-md border border-gray5 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition",
            isPlaceholder ? "text-gray5" : "text-gray-900",
            className
          )}
          value={value}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Chevron, positioned inwards */}
        <FiChevronDown
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray5"
          size={22}
        />
      </div>
    );
  }
);
Select.displayName = "Select";
