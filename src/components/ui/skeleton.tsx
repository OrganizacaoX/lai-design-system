import { cn } from "cn";

function Skeleton({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { variant?: "default" | "circle" }) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse bg-muted",
        variant === "circle" ? "rounded-full" : "rounded-md",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
