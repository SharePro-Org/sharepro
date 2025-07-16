// components/ui/card.tsx
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Card({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-sm p-8 md:p-10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
