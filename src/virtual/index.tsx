import { useRef, type ReactNode, type Key } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
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
export function VirtualList<T>({ items, getKey, renderItem, height = 400, estimateSize = 48, overscan = 5, label, className }: VirtualListProps<T>) {
  const parent = useRef<HTMLDivElement>(null);
  const virtual = useVirtualizer({ count: items.length, getScrollElement: () => parent.current, estimateSize: () => estimateSize,
    overscan, getItemKey: index => getKey(items[index], index) });
  return <div ref={parent} role="list" aria-label={label} tabIndex={0} className={className} style={{ height, overflow: "auto" }}>
    <div style={{ height: virtual.getTotalSize(), position: "relative", width: "100%" }}>
      {virtual.getVirtualItems().map(row => <div key={row.key} ref={virtual.measureElement} data-index={row.index}
        role="listitem" aria-posinset={row.index + 1} aria-setsize={items.length}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${row.start}px)` }}>
        {renderItem(items[row.index], row.index)}
      </div>)}
    </div>
  </div>;
}
