import { StatusPanel } from "@organizacaox/lai-design-system";
import { createFileRoute } from "@organizacaox/lai-design-system/router";
export const Route = createFileRoute("/signed-out")({
  component: () => <StatusPanel state="success" title="Sessão encerrada" />,
});
