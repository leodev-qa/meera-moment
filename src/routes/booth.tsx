import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { KioskApp } from "@/components/kiosk/KioskApp";

const boothSearch = z.object({
  event: z.string().optional(),
  cam: z.string().optional(),
});

export const Route = createFileRoute("/booth")({
  validateSearch: boothSearch,
  component: KioskApp,
});
