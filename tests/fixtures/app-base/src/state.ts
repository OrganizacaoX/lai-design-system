import { create, persist, createJSONStorage } from "@organizacaox/lai-design-system/store";
interface DraftState { note: string; setNote: (note: string) => void }
export const useDraft = create<DraftState>()(persist(
  (set) => ({ note: "", setNote: (note) => set({ note }) }),
  { name: "lai-app-example-draft", version: 1, storage: createJSONStorage(() => localStorage), partialize: ({ note }) => ({ note }) },
));
export async function resetDraft() {
  useDraft.setState(useDraft.getInitialState(), true);
  await useDraft.persist.clearStorage();
}
