// GET/POST handlers for the signed-in user's participated events, backed by a
// JSON file. GET returns the stored Service array; POST appends a Service (JSON
// body, de-duplicated by id) and returns the updated array. Used by the drawer
// in components/CurrentEventsPanel.tsx via backend/DataUtils.
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  CITY,
  EDUCATIONTYPE,
  SERVICETAGS,
  SERVICETYPE,
  type Service,
} from "../../backend/DataUtils";

const CURRENT_EVENTS_FILE = path.join(
  process.cwd(),
  "backend/dataStorage/currentevents.json",
);

async function readCurrentEvents(): Promise<Service[]> {
  let raw: string;
  try {
    raw = await fs.readFile(CURRENT_EVENTS_FILE, "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
  if (raw.trim() === "") return [];
  return JSON.parse(raw) as Service[];
}

function isService(value: unknown): value is Service {
  if (typeof value !== "object" || value === null) return false;

  const service = value as Record<string, unknown>;
  const validTags = Object.values(SERVICETAGS) as string[];
  const validCities = Object.values(CITY) as string[];
  const validServiceTypes = Object.values(SERVICETYPE) as string[];
  const validEducationTypes = Object.values(EDUCATIONTYPE).filter(
    (value): value is number => typeof value === "number",
  );

  return (
    typeof service.id === "string" &&
    service.id !== "" &&
    typeof service.image === "string" &&
    typeof service.title === "string" &&
    typeof service.description === "string" &&
    typeof service.location === "string" &&
    validCities.includes(service.location) &&
    typeof service.address === "string" &&
    service.address !== "" &&
    typeof service.author === "string" &&
    typeof service.type === "string" &&
    validServiceTypes.includes(service.type) &&
    typeof service.credit === "number" &&
    Number.isInteger(service.credit) &&
    Array.isArray(service.tags) &&
    (service.tags as unknown[]).length > 0 &&
    (service.tags as string[]).every((tag) => validTags.includes(tag)) &&
    typeof service.time === "string" &&
    !Number.isNaN(Date.parse(service.time)) &&
    typeof service.eduType === "number" &&
    validEducationTypes.includes(service.eduType)
  );
}

export async function GET() {
  return Response.json(await readCurrentEvents());
}

export async function POST(request: Request) {
  let event: unknown;
  try {
    event = await request.json();
  } catch {
    return Response.json(
      { error: "a JSON service object is required" },
      { status: 400 },
    );
  }

  if (!isService(event)) {
    return Response.json(
      {
        error:
          "a JSON service object (id, image, title, description, location, address, author, type, credit, tags, time, eduType) is required",
      },
      { status: 400 },
    );
  }

  const events = await readCurrentEvents();
  if (events.some((current) => current.id === event.id)) {
    // Already participated; keep the list unchanged so a repeated join can't
    // add a duplicate row.
    return Response.json(events);
  }

  events.push(event);
  await fs.writeFile(
    CURRENT_EVENTS_FILE,
    JSON.stringify(events, null, 2),
    "utf8",
  );

  return Response.json(events);
}

export async function DELETE(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "id (string) is required" }, { status: 400 });
  }

  const id = (body as { id?: unknown }).id;
  if (typeof id !== "string" || id === "") {
    return Response.json({ error: "id (string) is required" }, { status: 400 });
  }

  const events = await readCurrentEvents();
  const remaining = events.filter((event) => event.id !== id);

  if (remaining.length === events.length) {
    return Response.json(
      { error: "Current event not found" },
      { status: 404 },
    );
  }

  await fs.writeFile(
    CURRENT_EVENTS_FILE,
    JSON.stringify(remaining, null, 2),
    "utf8",
  );

  return Response.json(remaining);
}
