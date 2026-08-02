import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  addCurrentEventToServer,
  getCurrentEventsFromServer,
  removeCurrentEventFromServer,
  CITY,
  EDUCATIONTYPE,
  SERVICETAGS,
  SERVICETYPE,
  type Service,
} from "../backend/DataUtils";

const CURRENT_EVENTS_ENDPOINT = "/currentevents.json";

const makeEvent = (): Service => ({
  id: "event-1",
  image: "https://images.unsplash.com/photo-1610701596007?w=900&h=700&fit=crop",
  title: "Game Jam",
  description: "Build a game in 48 hours.",
  location: CITY.WELLINGTON,
  address: "Victoria University of Wellington, Kelburn, Wellington",
  author: "WDCC Game Dev Club",
  type: SERVICETYPE.HACKATHON,
  credit: 50,
  tags: [SERVICETAGS.WEB_DEVELOPMENT],
  time: "2026-08-22T09:00:00.000Z",
  eduType: EDUCATIONTYPE.FIRST_YEAR,
});

describe("CurrentEventsUtils", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe("getCurrentEventsFromServer", () => {
    it("returns the participated events from the server", async () => {
      const events = [makeEvent()];
      fetchMock.mockResolvedValue(
        new Response(JSON.stringify(events), { status: 200 }),
      );

      await expect(getCurrentEventsFromServer()).resolves.toEqual(events);
    });

    it("returns an empty array when the user has joined no events", async () => {
      fetchMock.mockResolvedValue(new Response("[]", { status: 200 }));

      await expect(getCurrentEventsFromServer()).resolves.toEqual([]);
    });

    it("fetches /currentevents.json with a GET request", async () => {
      fetchMock.mockResolvedValue(new Response("[]", { status: 200 }));

      await getCurrentEventsFromServer();

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe(CURRENT_EVENTS_ENDPOINT);
      expect(init?.method ?? "GET").toBe("GET");
    });

    it("throws when the request fails", async () => {
      fetchMock.mockResolvedValue(new Response("error", { status: 500 }));

      await expect(getCurrentEventsFromServer()).rejects.toThrow(
        "Failed to load current events (500)",
      );
    });
  });

  describe("addCurrentEventToServer", () => {
    it("posts the event as JSON and returns the updated list", async () => {
      const event = makeEvent();
      const updated = [event];
      fetchMock.mockResolvedValue(
        new Response(JSON.stringify(updated), { status: 200 }),
      );

      await expect(addCurrentEventToServer(event)).resolves.toEqual(updated);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe(CURRENT_EVENTS_ENDPOINT);
      expect(init.method).toBe("POST");
      expect(init.headers).toMatchObject({
        "Content-Type": "application/json",
      });
      expect(init.body).toBe(JSON.stringify(event));
    });

    it("throws with the server message when the save fails", async () => {
      fetchMock.mockResolvedValue(
        new Response(JSON.stringify({ error: "boom" }), { status: 500 }),
      );

      await expect(addCurrentEventToServer(makeEvent())).rejects.toThrow(
        "Failed to save current event (500): boom",
      );
    });
  });

  describe("removeCurrentEventFromServer", () => {
    it("deletes the event and returns the updated list", async () => {
      const remaining = [makeEvent()];
      fetchMock.mockResolvedValue(
        new Response(JSON.stringify(remaining), { status: 200 }),
      );

      await expect(
        removeCurrentEventFromServer("event-1"),
      ).resolves.toEqual(remaining);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe(CURRENT_EVENTS_ENDPOINT);
      expect(init.method).toBe("DELETE");
      expect(init.headers).toMatchObject({
        "Content-Type": "application/json",
      });
      expect(init.body).toBe(JSON.stringify({ id: "event-1" }));
    });

    it("throws with the server message when the event cannot be removed", async () => {
      fetchMock.mockResolvedValue(
        new Response(JSON.stringify({ error: "Current event not found" }), {
          status: 404,
        }),
      );

      await expect(removeCurrentEventFromServer("missing")).rejects.toThrow(
        "Failed to remove current event (404): Current event not found",
      );
    });
  });
});
