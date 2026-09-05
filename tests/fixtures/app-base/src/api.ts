import { createApiClient, createAppQueryClient } from "@organizacaox/lai-design-system/app";
import { queryOptions } from "@organizacaox/lai-design-system/query";
export interface Contact { id: string; name: string }
export const api = createApiClient({ baseURL: "/api" });
export const queryClient = createAppQueryClient();
export const contactsOptions = (q = "") => queryOptions({
  queryKey: ["contacts", { q }] as const,
  queryFn: ({ signal }) => api<Contact[]>("/contacts", { query: { q }, signal }),
});
export const contactOptions = (id: string) => queryOptions({
  queryKey: ["contact", id] as const,
  queryFn: ({ signal }) => api<Contact>(`/contacts/${id}`, { signal }),
});
