// Shared GET/POST/DELETE handlers for a JSON-backed services endpoint.
// Used by the standard endpoints (app/tasks.json, app/events.json) and the mock
// endpoints (app/tasksMock.json, app/eventsMock.json), so they all behave identically.
import { promises as fs } from "node:fs";
import path from "node:path";
import { SERVICETYPE, type Service } from "./DataUtils";

const DATA_DIR = "backend";

async function readServices(filePath: string): Promise<Service[]> {
  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
  if (raw.trim() === "") return [];
  return JSON.parse(raw) as Service[];
}

async function writeServices(
  filePath: string,
  services: Service[],
): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(services, null, 2), "utf8");
}

/** Parse the request body as FormData, or null when the body isn't a form. */
async function readFormData(request: Request): Promise<FormData | null> {
  try {
    return await request.formData();
  } catch {
    return null;
  }
}

/**
 * Create GET/POST/DELETE route handlers that read/write a JSON file inside
 * backend/. `file` is the file name, e.g. "tasks.json" or "tasksMock.json".
 */
export function createServiceRoutes({ file }: { file: string }) {
  const filePath = path.join(process.cwd(), DATA_DIR, file);

  async function GET() {
    return Response.json(await readServices(filePath));
  }

  async function POST(request: Request) {
    const formData = await readFormData(request);
    const id = formData?.get("id");
    const image = formData?.get("image");
    const title = formData?.get("title");
    const description = formData?.get("description");
    const location = formData?.get("location");
    const author = formData?.get("author");
    const type = formData?.get("type");

    if (
      typeof id !== "string" ||
      id === "" ||
      !(image instanceof File) ||
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof location !== "string" ||
      typeof author !== "string" ||
      (type !== SERVICETYPE.TASK && type !== SERVICETYPE.EVENT)
    ) {
      return Response.json(
        {
          error:
            "id (string), image (file), title (string), description (string), location (string), author (string) and type (TASK|EVENTS) are required",
        },
        { status: 400 },
      );
    }

    const imageDataUrl = `data:${image.type};base64,${Buffer.from(
      await image.arrayBuffer(),
    ).toString("base64")}`;

    const service: Service = {
      id,
      image: imageDataUrl,
      title,
      description,
      location,
      author,
      type,
    };

    const services = await readServices(filePath);
    services.push(service);
    await writeServices(filePath, services);

    return Response.json(service, { status: 201 });
  }

  async function DELETE(request: Request) {
    const formData = await readFormData(request);
    const id = formData?.get("id");

    if (typeof id !== "string" || id === "") {
      return Response.json({ error: "id (string) is required" }, { status: 400 });
    }

    const services = await readServices(filePath);
    const remaining = services.filter((service) => service.id !== id);

    if (remaining.length === services.length) {
      return Response.json({ error: "Service not found" }, { status: 404 });
    }

    await writeServices(filePath, remaining);

    return Response.json({ deleted: id });
  }

  return { GET, POST, DELETE };
}