// This file contains utility functions for sending and receiving data to/from the server.
// To use these functions/types, import them like this:
// import { SERVICETYPE, PostData, Service, sendServiceToServer, getTasksFromServer, getEventsFromServer, deleteTaskInServer } from "./DataUtils";
//

// !!!!!!!!!!!!!!!!! TO RUN MOCK DATA !!!!!!!!!!!!!!!!!
// Where these functions read/write data is controlled by DATA_SOURCE in ./dataSource.ts.
// Toggle it from the command line with `node backend/toggle.mjs <mock|standard>`
// (see backend/toggle.mjs for full usage).

import { DATA_SOURCE } from "./dataSource";

// Endpoints DataUtils talks to. In "mock" mode they point at the mock datasets
// (backend/dataStorage/tasksMock.json & backend/dataStorage/eventsMock.json);
// in "standard" mode at the real datasets (backend/dataStorage/tasks.json &
// backend/dataStorage/events.json).
const TASKS_ENDPOINT = DATA_SOURCE === "mock" ? "/tasksMock.json" : "/tasks.json";
const EVENTS_ENDPOINT =
  DATA_SOURCE === "mock" ? "/eventsMock.json" : "/events.json";

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
}

/** Cities a service can be located in. */
export enum CITY {
  HAMILTON = "Hamilton",
  AUCKLAND = "Auckland",
  CHRISTCHURCH = "Christchurch",
  WELLINGTON = "Wellington",
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

    // SERVICETYPE no longer distinguishes tasks from events, so every posting is
    // a marketplace listing and goes to the events endpoint.
    const destination = EVENTS_ENDPOINT;

    await fetch(destination, {
      method: "POST",
      body: formData,
    });
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
  const response = await fetch(EVENTS_ENDPOINT);
  if (!response.ok) {
    throw new Error(`Failed to load events (${response.status})`);
  }
  return response.json();
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
