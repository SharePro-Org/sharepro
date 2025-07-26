import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  prefix?: React.ReactNode;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", prefix, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false);
    return (
      <div
        tabIndex={0}
        className={cn(
          "flex items-center w-full border border-gray5 rounded-md bg-white",
          focused ? "ring-2 ring-primary ring-offset-2" : "",
          className
        )}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        {prefix && <span className="text-sm text-nowrap text-gray-600 px-3">{prefix}</span>}
        <input
          type={type}
          className={cn(
            "flex h-[55px] w-full rounded-md border-none bg-transparent px-3 py-2 text-sm placeholder:text-gray5 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray5",
            prefix ? "pl-0" : ""
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";
