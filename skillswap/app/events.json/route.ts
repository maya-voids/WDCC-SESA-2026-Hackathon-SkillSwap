import { createServiceRoutes } from "../../backend/serviceRoutes";

// Standard events endpoint — reads/writes backend/events.json.
// DataUtils points here unless toggled to mock mode (see backend/toggle.mjs).
const routes = createServiceRoutes({ file: "events.json" });

export const GET = routes.GET;
export const POST = routes.POST;
export const DELETE = routes.DELETE;