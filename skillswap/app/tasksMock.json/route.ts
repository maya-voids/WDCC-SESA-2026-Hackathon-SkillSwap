import { createServiceRoutes } from "../../backend/serviceRoutes";

// Mock tasks endpoint — reads/writes backend/dataStorage/tasksMock.json.
// DataUtils points here when toggled to mock mode (see backend/toggle.mjs).
const routes = createServiceRoutes({ file: "tasksMock.json" });

export const GET = routes.GET;
export const POST = routes.POST;
export const DELETE = routes.DELETE;