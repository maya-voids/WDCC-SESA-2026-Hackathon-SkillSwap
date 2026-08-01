import { createServiceRoutes } from "../../backend/serviceRoutes";

// Standard tasks endpoint — reads/writes backend/dataStorage/tasks.json.
// DataUtils points here unless toggled to mock mode (see backend/toggle.mjs).
const routes = createServiceRoutes({ file: "tasks.json" });

export const GET = routes.GET;
export const POST = routes.POST;
export const DELETE = routes.DELETE;