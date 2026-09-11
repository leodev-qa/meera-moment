import { createFileRoute } from "@tanstack/react-router";
import { ShareView } from "@/components/share/ShareView";

export const Route = createFileRoute("/share/$id")({
  component: SharePage,
});

function SharePage() {
  const { id } = Route.useParams();
  return <ShareView id={id} />;
}
