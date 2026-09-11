import { createFileRoute } from "@tanstack/react-router";
import { Desk } from "@/components/campaign/Desk";

export const Route = createFileRoute("/campaign")({ component: Desk });
