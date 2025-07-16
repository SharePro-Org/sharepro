import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const base =
      "inline-flex w-full h-[59px] items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    const variants = {
      default: "bg-primary text-white hover:bg-primary/90",
      outline: "border border-primary bg-white hover:bg-gray5 ",
    };
    return (
      <button
        className={cn(base, variants[variant], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
