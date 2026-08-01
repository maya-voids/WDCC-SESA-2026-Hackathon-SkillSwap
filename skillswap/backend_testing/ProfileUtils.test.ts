import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { changeCredits, getCredits } from "../backend/ProfileUtils";

describe("ProfileUtils", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe("getCredits", () => {
    it("returns the credit balance from the server", async () => {
      fetchMock.mockResolvedValue(
        new Response(JSON.stringify({ credits: 250 }), { status: 200 }),
      );

      await expect(getCredits()).resolves.toBe(250);
    });

    it("fetches /profile.json with a GET request", async () => {
      fetchMock.mockResolvedValue(
        new Response(JSON.stringify({ credits: 250 }), { status: 200 }),
      );

      await getCredits();

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe("/profile.json");
      expect(init?.method ?? "GET").toBe("GET");
    });

    it("throws when the request fails", async () => {
      fetchMock.mockResolvedValue(new Response("error", { status: 500 }));

      await expect(getCredits()).rejects.toThrow("Failed to load credits (500)");
    });
  });

  describe("changeCredits", () => {
    it("adds the amount to the current balance and posts the new balance", async () => {
      fetchMock
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ credits: 1000 }), { status: 200 }),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ credits: 940 }), { status: 200 }),
        );

      await expect(changeCredits(-60)).resolves.toBe(940);

      expect(fetchMock).toHaveBeenCalledTimes(2);
      const [, getInit] = fetchMock.mock.calls[0];
      expect(getInit?.method ?? "GET").toBe("GET");

      const [postUrl, postInit] = fetchMock.mock.calls[1];
      expect(postUrl).toBe("/profile.json");
      expect(postInit.method).toBe("POST");

      const formData = postInit.body as FormData;
      expect(formData.get("credits")).toBe("940");
    });

    it("earns credits when the amount is positive", async () => {
      fetchMock
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ credits: 100 }), { status: 200 }),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ credits: 130 }), { status: 200 }),
        );

      await expect(changeCredits(30)).resolves.toBe(130);
    });

    it("throws when the save fails", async () => {
      fetchMock
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ credits: 1000 }), { status: 200 }),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ error: "boom" }), { status: 500 }),
        );

      await expect(changeCredits(-50)).rejects.toThrow(
        "Failed to save credits (500): boom",
      );
    });
  });
});
