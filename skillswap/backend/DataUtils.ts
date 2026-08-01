// This file contains utility functions for sending and receiving data to/from the server.
// To use these functions/types, import them like this:
// import { SERVICETYPE, PostData, Service, sendServiceToServer, getTasksFromServer, getEventsFromServer, deleteTaskInServer } from "./DataUtils";
//

// !!!!!!!!!!!!!!!!! TO RUN MOCK DATA !!!!!!!!!!!!!!!!!
// Which datasets are read is controlled by DATA_SOURCE in ./dataSource.ts.
// New marketplace listings are always published to events.json.
// Toggle it from the command line with `node backend/toggle.mjs <mock|standard>`
// (see backend/toggle.mjs for full usage).

import { DATA_SOURCE } from "./dataSource";

// Read endpoints DataUtils talks to. Mock mode combines seeded mock events with
// events.json so newly published listings remain visible after a reload.
const TASKS_ENDPOINT = DATA_SOURCE === "mock" ? "/tasksMock.json" : "/tasks.json";
const PUBLISHED_EVENTS_ENDPOINT = "/events.json";
const EVENT_READ_ENDPOINTS =
  DATA_SOURCE === "mock"
    ? ["/eventsMock.json", PUBLISHED_EVENTS_ENDPOINT]
    : [PUBLISHED_EVENTS_ENDPOINT];

export enum SERVICETYPE {
  WORKSHOP = "WORKSHOP",
  EXPO = "EXPO",
  HACKATHON = "HACKATHON",
  STUDENT_WORK = "STUDENT WORK",
  OTHER = "OTHER",
}

export enum SERVICETAGS {
  WEB_DEVELOPMENT = "Web Development",
  WEB_DESIGN = "Web Design",
  TYPESCRIPT = "TypeScript",
  CREATIVE_DESIGN = "Creative Design",
  PYTHON = "Python",
  FIRMWARE = "Firmware",
  HARDWARE = "Hardware",
}

/** Cities a service can be located in. */
export enum CITY {
  HAMILTON = "Hamilton",
  AUCKLAND = "Auckland",
  CHRISTCHURCH = "Christchurch",
  WELLINGTON = "Wellington",
  DUNEDIN = "Dunedin",
  PUKEKOHE = "Pukekohe",
}

/** Education level, ordered by a numbered index (1 = first-year … 3 = graduate). */
export enum EDUCATIONTYPE {
  FIRST_YEAR = 1,
  SECOND_YEAR = 2,
  GRADUATE = 3,
}

export type PostData = {
  id: string;
  image: File;
  title: string;
  description: string;
  location: CITY;
  /** Free-form street address. */
  address: string;
  author: string;
  type: SERVICETYPE;
  /** Positive or negative integer credit value. */
  credit: number;
  tags: SERVICETAGS[];
  /** UTC timestamp (ISO 8601). */
  time: string;
  eduType: EDUCATIONTYPE;
};

/** A service (task or event) as stored on the server; the image is a base64 data URL. */
export type Service = {
  id: string;
  image: string;
  title: string;
  description: string;
  location: CITY;
  /** Free-form street address. */
  address: string;
  author: string;
  type: SERVICETYPE;
  /** Positive or negative integer credit value. */
  credit: number;
  tags: SERVICETAGS[];
  /** UTC timestamp (ISO 8601). */
  time: string;
  eduType: EDUCATIONTYPE;
};

/** Convert an EDUCATIONTYPE to its formally capitalised display label. Used only by tests. */
export function educationTypeToLabel(eduType: EDUCATIONTYPE): string {
  switch (eduType) {
    case EDUCATIONTYPE.FIRST_YEAR:
      return "First Year";
    case EDUCATIONTYPE.SECOND_YEAR:
      return "Second Year";
    case EDUCATIONTYPE.GRADUATE:
      return "Graduate";
    default:
      // Unreachable for valid EDUCATIONTYPE values.
      return "";
  }
}

export async function sendServiceToServer(data: PostData): Promise<void> {
  try {
    const formData = new FormData();
    formData.append("id", data.id);
    formData.append("image", data.image);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("location", data.location);
    formData.append("address", data.address);
    formData.append("author", data.author);
    formData.append("type", data.type);
    formData.append("credit", String(data.credit));
    data.tags.forEach((tag) => formData.append("tags", tag));
    formData.append("time", data.time);
    formData.append("eduType", String(data.eduType));

    // Published listings always go to the real events dataset. In mock mode the
    // marketplace reads both seeded mock events and these published events.
    const response = await fetch(PUBLISHED_EVENTS_ENDPOINT, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let serverMessage = "";

      try {
        const payload = (await response.json()) as { error?: unknown };
        if (typeof payload.error === "string") {
          serverMessage = `: ${payload.error}`;
        }
      } catch {
        // The status code still provides a useful error when the body is not JSON.
      }

      throw new Error(
        `Failed to publish service (${response.status})${serverMessage}`,
      );
    }
  } catch (error) {
    console.error("Error sending data to server:", error);
    throw error;
  }
}

export async function getTasksFromServer(): Promise<Service[]> {
  const response = await fetch(TASKS_ENDPOINT);
  if (!response.ok) {
    throw new Error(`Failed to load tasks (${response.status})`);
  }
  return response.json();
}

export async function getEventsFromServer(): Promise<Service[]> {
  const responses = await Promise.all(
    EVENT_READ_ENDPOINTS.map((endpoint) => fetch(endpoint)),
  );

  const failedResponse = responses.find((response) => !response.ok);
  if (failedResponse) {
    throw new Error(`Failed to load events (${failedResponse.status})`);
  }

  const eventGroups = await Promise.all(
    responses.map((response) => response.json() as Promise<Service[]>),
  );
  const eventsById = new Map(
    eventGroups.flat().map((service) => [service.id, service]),
  );

  return [...eventsById.values()];
}

export async function deleteTaskInServer(id: string): Promise<void> {
  const formData = new FormData();
  formData.append("id", id);

  const response = await fetch(TASKS_ENDPOINT, {
    method: "DELETE",
    body: formData,
  });
  if (!response.ok) {
    throw new Error(`Failed to delete task (${response.status})`);
  }
}
