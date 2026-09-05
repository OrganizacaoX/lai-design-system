import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Semantic headings: choose the level by document structure, not visual size. */
export function Title({ className, ...props }: ComponentProps<"h1">) {
  return <h1 data-slot="typography-h1" className={cn("scroll-m-20 text-4xl leading-tight font-extrabold tracking-tight text-balance wrap-anywhere lg:text-5xl", className)} {...props} />;
}

export function SubTitle({ className, ...props }: ComponentProps<"h2">) {
  return <h2 data-slot="typography-h2" className={cn("scroll-m-20 border-b pb-2 text-3xl leading-tight font-semibold tracking-tight text-balance wrap-anywhere", className)} {...props} />;
}

export function SectionTitle({ className, ...props }: ComponentProps<"h3">) {
  return <h3 data-slot="typography-h3" className={cn("scroll-m-20 text-2xl leading-snug font-semibold tracking-tight text-balance wrap-anywhere", className)} {...props} />;
}

export function SectionSubTitle({ className, ...props }: ComponentProps<"h4">) {
  return <h4 data-slot="typography-h4" className={cn("scroll-m-20 text-xl leading-snug font-semibold tracking-tight text-balance wrap-anywhere", className)} {...props} />;
}

export function Text({ className, ...props }: ComponentProps<"p">) {
  return <p data-slot="typography-p" className={cn("mt-6 text-base leading-7 wrap-anywhere first:mt-0", className)} {...props} />;
}

export function Quote({ className, ...props }: ComponentProps<"blockquote">) {
  return <blockquote data-slot="typography-blockquote" className={cn("my-6 border-s-2 ps-6 text-base leading-7 italic wrap-anywhere", className)} {...props} />;
}

export function BulletList({ className, ...props }: ComponentProps<"ul">) {
  return <ul data-slot="typography-list" className={cn("my-6 list-disc ps-6 text-base leading-7 wrap-anywhere [&>li]:mt-2", className)} {...props} />;
}

export function NumberedList({ className, ...props }: ComponentProps<"ol">) {
  return <ol data-slot="typography-ordered-list" className={cn("my-6 list-decimal ps-6 text-base leading-7 wrap-anywhere [&>li]:mt-2", className)} {...props} />;
}

export function InlineCode({ className, ...props }: ComponentProps<"code">) {
  return <code data-slot="typography-inline-code" className={cn("rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-[0.875em] font-semibold wrap-anywhere", className)} {...props} />;
}

export function Lead({ className, ...props }: ComponentProps<"p">) {
  return <p data-slot="typography-lead" className={cn("text-xl leading-8 text-muted-foreground wrap-anywhere", className)} {...props} />;
}

export function Highlight({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="typography-large" className={cn("text-lg leading-7 font-semibold wrap-anywhere", className)} {...props} />;
}

export function Caption({ className, ...props }: ComponentProps<"small">) {
  return <small data-slot="typography-small" className={cn("text-sm leading-5 font-medium wrap-anywhere", className)} {...props} />;
}

export function Description({ className, ...props }: ComponentProps<"p">) {
  return <p data-slot="typography-muted" className={cn("text-sm leading-6 text-muted-foreground wrap-anywhere", className)} {...props} />;
}

export function TextLink({ className, ...props }: ComponentProps<"a">) {
  return <a data-slot="typography-link" className={cn("rounded-sm font-medium text-primary underline underline-offset-4 wrap-anywhere hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring", className)} {...props} />;
}
