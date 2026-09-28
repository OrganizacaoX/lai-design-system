import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "cn";

// Toda parte aceita `render` para trocar o elemento sem perder estilo e slot:
// `<Card render={<li />}>` numa lista, `<CardHeader render={<header />}>`.
type CardPartProps = useRender.ComponentProps<"div">;

function useCardPart(
  slot: string,
  classes: string,
  { className, render, ...props }: CardPartProps,
  state: Record<string, string> = {},
) {
  // `state` vira data-* (data-slot, data-size), como no Badge.
  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">({ className: cn(classes, className) }, props),
    state: { slot, ...state },
  });
}

function Card({
  size = "default",
  ...props
}: useRender.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return useCardPart(
    "card",
    "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
    props,
    { size },
  );
}

function CardHeader(props: CardPartProps) {
  return useCardPart(
    "card-header",
    "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
    props,
  );
}

function CardTitle(props: CardPartProps) {
  return useCardPart(
    "card-title",
    "font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
    props,
  );
}

function CardDescription(props: CardPartProps) {
  return useCardPart(
    "card-description",
    "text-sm text-muted-foreground",
    props,
  );
}

function CardAction(props: CardPartProps) {
  return useCardPart(
    "card-action",
    "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
    props,
  );
}

function CardContent(props: CardPartProps) {
  return useCardPart("card-content", "px-(--card-spacing)", props);
}

function CardFooter(props: CardPartProps) {
  return useCardPart(
    "card-footer",
    "flex items-center rounded-b-xl border-t bg-muted/50 p-(--card-spacing)",
    props,
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
