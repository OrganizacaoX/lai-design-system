import type { ComponentProps, CSSProperties } from "react";
import { cn } from "@/lib/utils";

export interface ShimmerProps extends ComponentProps<"span"> {
  active?: boolean;
  /** Duration of one pass, in milliseconds. Invalid values fall back to 2000. */
  duration?: number;
  once?: boolean;
  reverse?: boolean;
  /** CSS color and length, e.g. var(--primary) and 4ch. */
  color?: string;
  spread?: string;
}

/** Text shimmer from shadcn. Add role="status" only when the text is a live status. */
export function Shimmer({ active = true, duration = 2000, once = false, reverse = false,
  color, spread, className, style, ...props }: ShimmerProps) {
  const durationMs = Number.isFinite(duration) && duration > 0 ? duration : 2000;
  return <span data-slot="shimmer" data-active={active}
    className={cn("inline-block", active && "shimmer", active && once && "shimmer-once", active && reverse && "shimmer-reverse", className)}
    style={{ "--shimmer-duration": `${durationMs}ms`, ...(color && { "--shimmer-color": color }), ...(spread && { "--shimmer-spread": spread }), ...style } as CSSProperties}
    {...props} />;
}
