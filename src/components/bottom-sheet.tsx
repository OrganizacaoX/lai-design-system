import { useLaiTranslation } from "@/hooks/use-lai-translation";
import { useState, type ReactNode, type CSSProperties, useEffect } from "react";
import { Drawer, DrawerContent, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_SNAP_POINTS = [0.25, 0.5, 0.75];

export interface BottomSheetProps {
  title?: ReactNode;
  closeLabel?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  snapPoints?: number[];
  initialSnapIndex?: number;
  maxHeight?: number;
  minHeight?: number;
}

/** Controlled bottom sheet with accessible title and a scroll area adjusted to the active snap. */
export function BottomSheet({
  title,
  closeLabel,
  isOpen,
  onClose,
  children,
  className,
  snapPoints = DEFAULT_SNAP_POINTS,
  initialSnapIndex = 1,
  maxHeight = 0.9,
  minHeight = 0.1,
}: BottomSheetProps) {
  const { t } = useLaiTranslation();
  if (title === undefined) title = t("panel.title");
  closeLabel ??= t("panel.close");
  const initialSnap = snapPoints[initialSnapIndex] ?? snapPoints[0];
  const [snapPoint, setSnapPoint] = useState<number | string | null>(initialSnap);
  useEffect(() => {
    if (isOpen) setSnapPoint(initialSnap);
  }, [isOpen, initialSnap]);
  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      showSwipeHandle
      snapPoints={snapPoints}
      snapPoint={snapPoint}
      onSnapPointChange={setSnapPoint}
    >
      <DrawerContent
        className={cn("mx-auto max-w-md", className)}
        style={
          {
            // LAI registers its offset without inheritance; bridge it for the scroll area.
            "--lai-bottom-sheet-offset": "var(--drawer-snap-point-offset, 0px)",
            "--drawer-content-max-height": `${maxHeight * 100}dvh`,
            minHeight: `${minHeight * 100}dvh`,
          } as CSSProperties
        }
      >
        <div className="flex shrink-0 items-center justify-between gap-2 px-4 py-2">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerClose render={<Button variant="ghost" size="icon-sm" aria-label={closeLabel} />}>
            <X />
          </DrawerClose>
        </div>
        <div
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4"
          style={{ marginBottom: "var(--lai-bottom-sheet-offset, 0px)" }}
        >
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default BottomSheet;
