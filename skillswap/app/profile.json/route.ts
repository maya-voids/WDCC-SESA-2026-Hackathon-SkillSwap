// GET/POST handlers for the signed-in user's profile, backed by a JSON file.
// GET returns the stored credit balance; POST overwrites it with the supplied
// absolute value. Used by ProfileUtils (backend/ProfileUtils.ts).
import { promises as fs } from "node:fs";
import path from "node:path";

const PROFILE_FILE = path.join(
  process.cwd(),
  "backend/dataStorage/profile.json",
);

async function readProfile(): Promise<{ credits: number }> {
  try {
    const raw = await fs.readFile(PROFILE_FILE, "utf8");
    return JSON.parse(raw) as { credits: number };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return { credits: 1000 };
    }
    throw err;
  }
}

export async function GET() {
  return Response.json(await readProfile());
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      { error: "credits (integer) is required" },
      { status: 400 },
    );
  }

  const rawCredits = formData.get("credits");
  if (
    rawCredits === null ||
    rawCredits === "" ||
    !Number.isInteger(Number(rawCredits))
  ) {
    return Response.json(
      { error: "credits (integer) is required" },
      { status: 400 },
    );
  }

  const profile = { credits: Number(rawCredits) };
  await fs.writeFile(PROFILE_FILE, JSON.stringify(profile, null, 2), "utf8");

  return Response.json(profile, { status: 200 });
}
