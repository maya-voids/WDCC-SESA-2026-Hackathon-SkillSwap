import { promises as fs } from "node:fs";
import path from "node:path";
import { SERVICETYPE, type Task } from "../../backend/DataUtils";

const TASKS_FILE = path.join(process.cwd(), "backend", "tasks.json");

async function readTasks(): Promise<Task[]> {
  let raw: string;
  try {
    raw = await fs.readFile(TASKS_FILE, "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
  if (raw.trim() === "") return [];
  return JSON.parse(raw) as Task[];
}

async function writeTasks(tasks: Task[]): Promise<void> {
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2), "utf8");
}

/** Parse the request body as FormData, or null when the body isn't a form. */
async function readFormData(request: Request): Promise<FormData | null> {
  try {
    return await request.formData();
  } catch {
    return null;
  }
}

export async function GET() {
  const tasks = await readTasks();
  return Response.json(tasks);
}

export async function POST(request: Request) {
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
    (type !== SERVICETYPE.TASK && type !== SERVICETYPE.SERVICE)
  ) {
    return Response.json(
      {
        error:
          "id (string), image (file), title (string), description (string), location (string), author (string) and type (TASK|SERVICE) are required",
      },
      { status: 400 },
    );
  }

  const imageDataUrl = `data:${image.type};base64,${Buffer.from(
    await image.arrayBuffer(),
  ).toString("base64")}`;

  const task: Task = {
    id,
    image: imageDataUrl,
    title,
    description,
    location,
    author,
    type,
  };

  const tasks = await readTasks();
  tasks.push(task);
  await writeTasks(tasks);

  return Response.json(task, { status: 201 });
}

export async function DELETE(request: Request) {
  const formData = await readFormData(request);
  const id = formData?.get("id");

  if (typeof id !== "string" || id === "") {
    return Response.json({ error: "id (string) is required" }, { status: 400 });
  }

  const tasks = await readTasks();
  const remaining = tasks.filter((task) => task.id !== id);

  if (remaining.length === tasks.length) {
    return Response.json({ error: "Task not found" }, { status: 404 });
  }

  await writeTasks(remaining);

  return Response.json({ deleted: id });
}
