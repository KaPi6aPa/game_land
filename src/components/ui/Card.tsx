import * as React from "react";
import { cn } from "@/lib/cn";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border border-border bg-card text-card-foreground shadow-sm hover:border-border/80 transition-colors duration-300",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export { Card };