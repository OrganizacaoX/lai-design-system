import { messagingDemos } from "./demos-messaging";
import { patternDemos } from "./demos-patterns";
import { demos } from "./demos";
import { extraDemos } from "./demos-extra";
import { advancedDemos } from "./demos-advanced";
import type { Demo } from "./demos";

// Galeria completa, ordenada por nome do componente.
export const allDemos: Demo[] = [...demos, ...extraDemos, ...advancedDemos, ...patternDemos, ...messagingDemos].sort(
  (a, b) => a.title.localeCompare(b.title, "pt-BR"),
);
