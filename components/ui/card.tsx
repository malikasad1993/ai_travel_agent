import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Base Card
 * - Softer padding on mobile
 * - Keeps consistent spacing across app
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        `
        bg-card text-card-foreground
        flex flex-col gap-4 sm:gap-6
        rounded-xl border shadow-sm
        py-3 sm:py-2
        `,
        className
      )}
      {...props}
    />
  );
}

/**
 * Header
 * - Smaller padding on mobile
 * - Title + action wraps properly
 */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        `
        @container/card-header
        grid auto-rows-min items-start gap-2
        px-4 sm:px-6
        has-data-[slot=card-action]:grid-cols-[1fr_auto]
        [.border-b]:pb-4 sm:[.border-b]:pb-6
        `,
        className
      )}
      {...props}
    />
  );
}

/**
 * Title
 * - Scales text properly on mobile
 * - Prevents overflow
 */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-semibold leading-snug text-base sm:text-lg break-words",
        className
      )}
      {...props}
    />
  );
}

/**
 * Description
 * - Slightly smaller text on mobile
 */
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-muted-foreground text-sm leading-relaxed break-words",
        className
      )}
      {...props}
    />
  );
}

/**
 * Action (top-right buttons/icons)
 * - No change needed, but kept for consistency
 */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

/**
 * Content
 * - Reduced horizontal padding on mobile
 */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-4 sm:px-6", className)}
      {...props}
    />
  );
}

/**
 * Footer
 * - Stackable on mobile if needed
 */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        `
        flex flex-col sm:flex-row
        items-start sm:items-center
        gap-2 sm:gap-4
        px-4 sm:px-6
        [.border-t]:pt-4 sm:[.border-t]:pt-6
        `,
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
