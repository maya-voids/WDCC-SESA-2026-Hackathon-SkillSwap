import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  deleteTaskInServer,
  educationTypeToLabel,
  getEventsFromServer,
  getTasksFromServer,
  sendServiceToServer,
  CITY,
  EDUCATIONTYPE,
  SERVICETAGS,
  SERVICETYPE,
  type PostData,
} from "../backend/DataUtils";

describe("DataUtils", () => {
  const fetchMock = vi.fn();

  const makePost = (): PostData => ({
    id: "task-1",
    image: new File(["image-bytes"], "photo.png", { type: "image/png" }),
    title: "Sell a bike",
    description: "Needs new brakes.",
    location: CITY.WELLINGTON,
    address: "123 Willis Street, Wellington",
    author: "Alice",
    type: SERVICETYPE.WORKSHOP,
    credit: 50,
    tags: [SERVICETAGS.WEB_DEVELOPMENT, SERVICETAGS.TYPESCRIPT],
    time: "2026-08-01T12:00:00.000Z",
    eduType: EDUCATIONTYPE.FIRST_YEAR,
  });

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "error").mockImplementation(() => {});
    fetchMock.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe("sendServiceToServer", () => {
    it("resolves when the request succeeds", async () => {
      fetchMock.mockResolvedValue(new Response("ok", { status: 200 }));

      await expect(sendServiceToServer(makePost())).resolves.toBeUndefined();
    });

    it("resolves even when the server returns an error status", async () => {
      fetchMock.mockResolvedValue(new Response("boom", { status: 500 }));

      await expect(sendServiceToServer(makePost())).resolves.toBeUndefined();
    });

    it("rejects with the original error and logs it when the request fails", async () => {
      const error = new Error("network down");
      fetchMock.mockRejectedValue(error);

      await expect(sendServiceToServer(makePost())).rejects.toBe(error);
      expect(console.error).toHaveBeenCalledWith(
        "Error sending data to server:",
        error,
      );
    });

    it("posts all fields including location, author and type to /events.json", async () => {
      fetchMock.mockResolvedValue(new Response(null, { status: 200 }));
      const post = makePost();

      await sendServiceToServer(post);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe("/events.json");
      expect(init.method).toBe("POST");
      expect(init.body).toBeInstanceOf(FormData);

      const formData = init.body as FormData;
      expect(formData.get("id")).toBe(post.id);
      expect(formData.get("image")).toBe(post.image);
      expect(formData.get("title")).toBe(post.title);
      expect(formData.get("description")).toBe(post.description);
      expect(formData.get("location")).toBe(post.location);
      expect(formData.get("address")).toBe(post.address);
      expect(formData.get("author")).toBe(post.author);
      expect(formData.get("type")).toBe(post.type);
      expect(formData.get("credit")).toBe(String(post.credit));
      expect(formData.getAll("tags")).toEqual(post.tags);
      expect(formData.get("time")).toBe(post.time);
      expect(formData.get("eduType")).toBe(String(post.eduType));
      expect(init.headers).toBeUndefined();
    });

    it("posts the chosen SERVICETYPE to /events.json", async () => {
      fetchMock.mockResolvedValue(new Response(null, { status: 200 }));
      const post = { ...makePost(), type: SERVICETYPE.HACKATHON };

      await sendServiceToServer(post);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe("/events.json");
      expect(init.method).toBe("POST");
      const formData = init.body as FormData;
      expect(formData.get("type")).toBe(SERVICETYPE.HACKATHON);
    });
  });

  describe("getTasksFromServer", () => {
    it("returns the tasks from the server", async () => {
      const tasks = [
        {
          id: "task-1",
          image: "data:image/png;base64,abc",
          title: "T1",
          description: "D1",
          location: CITY.WELLINGTON,
          address: "123 Willis Street, Wellington",
          author: "Alice",
          type: SERVICETYPE.STUDENT_WORK,
          credit: 10,
          tags: [SERVICETAGS.TYPESCRIPT],
          time: "2026-08-01T09:00:00.000Z",
          eduType: EDUCATIONTYPE.SECOND_YEAR,
        },
      ];
      fetchMock.mockResolvedValue(
        new Response(JSON.stringify(tasks), { status: 200 }),
      );

      await expect(getTasksFromServer()).resolves.toEqual(tasks);
    });

    it("returns an empty array when the server has no tasks", async () => {
      fetchMock.mockResolvedValue(new Response("[]", { status: 200 }));

      await expect(getTasksFromServer()).resolves.toEqual([]);
    });

    it("fetches /tasks.json with a GET request", async () => {
      fetchMock.mockResolvedValue(new Response("[]", { status: 200 }));

      await getTasksFromServer();

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe("/tasks.json");
      expect(init?.method ?? "GET").toBe("GET");
    });

    it("throws when the request fails", async () => {
      fetchMock.mockResolvedValue(new Response("error", { status: 500 }));

      await expect(getTasksFromServer()).rejects.toThrow();
    });
  });

  describe("getEventsFromServer", () => {
    it("returns the events from the server", async () => {
      const events = [
        {
          id: "event-1",
          image: "data:image/png;base64,abc",
          title: "E1",
          description: "D1",
          location: CITY.WELLINGTON,
          address: "123 Willis Street, Wellington",
          author: "Alice",
          type: SERVICETYPE.WORKSHOP,
          credit: 20,
          tags: [SERVICETAGS.WEB_DESIGN],
          time: "2026-08-02T10:00:00.000Z",
          eduType: EDUCATIONTYPE.GRADUATE,
        },
      ];
      fetchMock.mockResolvedValue(
        new Response(JSON.stringify(events), { status: 200 }),
      );

      await expect(getEventsFromServer()).resolves.toEqual(events);
    });

    it("returns an empty array when the server has no events", async () => {
      fetchMock.mockResolvedValue(new Response("[]", { status: 200 }));

      await expect(getEventsFromServer()).resolves.toEqual([]);
    });

    it("fetches /events.json with a GET request", async () => {
      fetchMock.mockResolvedValue(new Response("[]", { status: 200 }));

      await getEventsFromServer();

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe("/events.json");
      expect(init?.method ?? "GET").toBe("GET");
    });

    it("throws when the request fails", async () => {
      fetchMock.mockResolvedValue(new Response("error", { status: 500 }));

      await expect(getEventsFromServer()).rejects.toThrow();
    });
  });

  describe("educationTypeToLabel", () => {
    it("returns the formally capitalised label for each EDUCATIONTYPE", () => {
      expect(educationTypeToLabel(EDUCATIONTYPE.FIRST_YEAR)).toBe("First Year");
      expect(educationTypeToLabel(EDUCATIONTYPE.SECOND_YEAR)).toBe(
        "Second Year",
      );
      expect(educationTypeToLabel(EDUCATIONTYPE.GRADUATE)).toBe("Graduate");
    });
  });

  describe("deleteTaskInServer", () => {
    it("sends a DELETE request to /tasks.json with the id", async () => {
      fetchMock.mockResolvedValue(
        new Response('{"deleted":"task-1"}', { status: 200 }),
      );

      await deleteTaskInServer("task-1");

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe("/tasks.json");
      expect(init.method).toBe("DELETE");

      const formData = init.body as FormData;
      expect(formData.get("id")).toBe("task-1");
    });

    it("resolves when the task is deleted", async () => {
      fetchMock.mockResolvedValue(
        new Response('{"deleted":"task-1"}', { status: 200 }),
      );

      await expect(deleteTaskInServer("task-1")).resolves.toBeUndefined();
    });

    it("throws when the task cannot be deleted", async () => {
      fetchMock.mockResolvedValue(
        new Response('{"error":"Task not found"}', { status: 404 }),
      );

      await expect(deleteTaskInServer("missing")).rejects.toThrow();
    });
  });
});
