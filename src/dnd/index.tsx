import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type UniqueIdentifier } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";
import { useLaiTranslation } from "../hooks/use-lai-translation";
const instructions = {
  pt: "Pressione espaço para mover. Use as setas para ordenar, espaço para soltar e Escape para cancelar.",
  en: "Press space to move. Use arrow keys to sort, space to drop and Escape to cancel.",
  es: "Pulsa espacio para mover. Usa las flechas para ordenar, espacio para soltar y Escape para cancelar.",
};
function SortableItem({ id, children, label }: { id: UniqueIdentifier; children: ReactNode; label: string }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id });
  return <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 }}>
    <button type="button" ref={setActivatorNodeRef} {...attributes} {...listeners} aria-label={label}
      style={{ touchAction: "none", cursor: "grab" }}>⠿</button>{children}
  </li>;
}
export interface SortableListProps<T> {
  items: T[];
  getId: (item: T) => UniqueIdentifier;
  getLabel: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  onReorder: (items: T[]) => void;
  label: string;
  className?: string;
}
export function SortableList<T>({ items, getId, getLabel, renderItem, onReorder, label, className }: SortableListProps<T>) {
  const { language } = useLaiTranslation();
  const lang = language.startsWith("en") ? "en" : language.startsWith("es") ? "es" : "pt";
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const ids = items.map(getId);
  const itemLabel = (id: UniqueIdentifier) => { const item = items.find(item => getId(item) === id); return item === undefined ? String(id) : getLabel(item); };
  const announcement = (id: UniqueIdentifier, over?: UniqueIdentifier) => `${itemLabel(id)}: ${over === undefined ? "" : `${ids.indexOf(over) + 1}/${items.length}`}`;
  return <DndContext sensors={sensors} collisionDetection={closestCenter}
    accessibility={{ screenReaderInstructions: { draggable: instructions[lang] }, announcements: {
      onDragStart: ({ active }) => announcement(active.id, active.id),
      onDragOver: ({ active, over }) => announcement(active.id, over?.id),
      onDragEnd: ({ active, over }) => announcement(active.id, over?.id),
      onDragCancel: ({ active }) => `${itemLabel(active.id)}: ${lang === "en" ? "Cancelled" : lang === "es" ? "Cancelado" : "Cancelado"}`,
    } }}
    onDragEnd={({ active, over }) => {
      if (!over || active.id === over.id) return;
      const from = ids.indexOf(active.id), to = ids.indexOf(over.id);
      if (from >= 0 && to >= 0) onReorder(arrayMove(items, from, to));
    }}>
    <SortableContext items={ids} strategy={verticalListSortingStrategy}>
      <ul aria-label={label} className={className}>{items.map(item => <SortableItem key={getId(item)} id={getId(item)} label={getLabel(item)}>{renderItem(item)}</SortableItem>)}</ul>
    </SortableContext>
  </DndContext>;
}
