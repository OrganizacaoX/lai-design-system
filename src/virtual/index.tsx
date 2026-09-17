import { useRef, type ReactNode, type Key, type CSSProperties } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "../lib/utils";
export interface VirtualListProps<T> {
  items: readonly T[];
  getKey: (item: T, index: number) => Key;
  renderItem: (item: T, index: number) => ReactNode;
  height?: number;
  estimateSize?: number;
  overscan?: number;
  label: string;
  className?: string;
}
export function VirtualList<T>({
  items,
  getKey,
  renderItem,
  height = 400,
  estimateSize = 48,
  overscan = 5,
  label,
  className,
}: VirtualListProps<T>) {
  const parent = useRef<HTMLDivElement>(null);
  const virtual = useVirtualizer({
    count: items.length,
    getScrollElement: () => parent.current,
    estimateSize: () => estimateSize,
    overscan,
    getItemKey: (index) => getKey(items[index], index),
  });
  return (
    <div
      ref={parent}
      role="list"
      aria-label={label}
      tabIndex={0}
      className={cn("h-(--virtual-height) overflow-auto", className)}
      style={{ "--virtual-height": `${height}px` } as CSSProperties}
    >
      <div
        className="relative h-(--virtual-total-height) w-full"
        style={
          {
            "--virtual-total-height": `${virtual.getTotalSize()}px`,
          } as CSSProperties
        }
      >
        {virtual.getVirtualItems().map((row) => (
          <div
            key={row.key}
            ref={virtual.measureElement}
            data-index={row.index}
            role="listitem"
            aria-posinset={row.index + 1}
            aria-setsize={items.length}
            className="absolute top-0 left-0 w-full transform-(--virtual-transform)"
            style={
              {
                "--virtual-transform": `translateY(${row.start}px)`,
              } as CSSProperties
            }
          >
            {renderItem(items[row.index], row.index)}
          </div>
        ))}
      </div>
    </div>
  );
}
