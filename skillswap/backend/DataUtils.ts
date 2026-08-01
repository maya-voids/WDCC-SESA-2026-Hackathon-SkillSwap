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
// (backend/tasksMock.json & backend/eventsMock.json); in "standard" mode at the
// real datasets (backend/tasks.json & backend/events.json).
const TASKS_ENDPOINT = DATA_SOURCE === "mock" ? "/tasksMock.json" : "/tasks.json";
const EVENTS_ENDPOINT =
  DATA_SOURCE === "mock" ? "/eventsMock.json" : "/events.json";

export enum SERVICETYPE {
  TASK = "TASK",
  EVENT = "EVENTS",
}

export enum SERVICETAGS {
  FIRST_YEAR = "First-Year",
  SECOND_YEAR = "Second-Year",
  GRADUATE = "Graduate",
  WEB_DEVELOPMENT = "Web Development",
  WEB_DESIGN = "Web Design",
  TYPESCRIPT = "TypeScript",
}

export type PostData = {
  id: string;
  image: File;
  title: string;
  description: string;
  location: string;
  author: string;
  type: SERVICETYPE;
  /** Positive or negative integer credit value. */
  credit: number;
  tags: SERVICETAGS[];
};

/** A service (task or event) as stored on the server; the image is a base64 data URL. */
export type Service = {
  id: string;
  image: string;
  title: string;
  description: string;
  location: string;
  author: string;
  type: SERVICETYPE;
  /** Positive or negative integer credit value. */
  credit: number;
  tags: SERVICETAGS[];
};

export async function sendServiceToServer(data: PostData): Promise<void> {
  try {
    const formData = new FormData();
    formData.append("id", data.id);
    formData.append("image", data.image);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("location", data.location);
    formData.append("author", data.author);
    formData.append("type", data.type);
    formData.append("credit", String(data.credit));
    data.tags.forEach((tag) => formData.append("tags", tag));

    const destination =
      data.type === SERVICETYPE.EVENT ? EVENTS_ENDPOINT : TASKS_ENDPOINT;

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
