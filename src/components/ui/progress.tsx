import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    indicatorClassName?: string;
    max?: number;
  }
>(({ className, value, indicatorClassName, max = 100, ...props }, ref) => {
  const percentage = Math.min(((value || 0) / max) * 100, 100);
  
  // Determine color based on value for DBR-style progress
  const getIndicatorColor = () => {
    if (value === undefined) return "bg-primary";
    const pct = (value / max) * 100;
    if (pct <= 40) return "bg-success";
    if (pct <= 55) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-full bg-muted",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full flex-1 transition-all duration-500 ease-out rounded-full",
          getIndicatorColor(),
          indicatorClassName
        )}
        style={{ width: `${percentage}%` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
