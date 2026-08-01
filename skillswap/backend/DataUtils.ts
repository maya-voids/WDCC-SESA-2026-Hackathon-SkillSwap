// This file contains utility functions for sending and receiving data to/from the server.
// To use these functions/types, import them like this:
// import { SERVICETYPE, PostData, Task, sendToServer, getTasksFromServer, deleteTaskInServer } from "./DataUtils";

export enum SERVICETYPE {
  TASK = "TASK",
  SERVICE = "SERVICE",
}

export type PostData = {
  id: string;
  image: File;
  title: string;
  description: string;
  location: string;
  author: string;
  type: SERVICETYPE;
};

/** A task as stored in tasks.json; the image is a base64 data URL. */
export type Task = {
  id: string;
  image: string;
  title: string;
  description: string;
  location: string;
  author: string;
  type: SERVICETYPE;
};

export async function sendToServer(data: PostData): Promise<void> {
  try {
    const formData = new FormData();
    formData.append("id", data.id);
    formData.append("image", data.image);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("location", data.location);
    formData.append("author", data.author);
    formData.append("type", data.type);

    await fetch("/tasks.json", {
      method: "POST",
      body: formData,
    });
  } catch (error) {
    console.error("Error sending data to server:", error);
    throw error;
  }
}

export async function getTasksFromServer(): Promise<Task[]> {
  const response = await fetch("/tasks.json");
  if (!response.ok) {
    throw new Error(`Failed to load tasks (${response.status})`);
  }
  return response.json();
}

export async function deleteTaskInServer(id: string): Promise<void> {
  const formData = new FormData();
  formData.append("id", id);

  const response = await fetch("/tasks.json", {
    method: "DELETE",
    body: formData,
  });
  if (!response.ok) {
    throw new Error(`Failed to delete task (${response.status})`);
  }
}
