import { createServiceRoutes } from "../../backend/serviceRoutes";

// Mock events endpoint — reads/writes backend/dataStorage/eventsMock.json.
// DataUtils points here when toggled to mock mode (see backend/toggle.mjs).
const routes = createServiceRoutes({ file: "eventsMock.json" });

export const GET = routes.GET;
export const POST = routes.POST;
export const DELETE = routes.DELETE;