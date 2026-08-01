import { describe, expect, it } from "vitest";
import { arrayReverse } from "../backend/GeneralUtils";
import { sortServicesByCreditAscending } from "../backend/DataQueries";
import {
  EDUCATIONTYPE,
  SERVICETAGS,
  SERVICETYPE,
  type Service,
} from "../backend/DataUtils";

function makeService(
  partial: Partial<Service> & Pick<Service, "id">,
): Service {
  return {
    image: "data:image/png;base64,abc",
    title: "T",
    description: "D",
    location: "Wellington",
    author: "Alice",
    type: SERVICETYPE.TASK,
    credit: 0,
    tags: [SERVICETAGS.WEB_DEVELOPMENT],
    time: "2026-08-01T00:00:00.000Z",
    eduType: EDUCATIONTYPE.FIRST_YEAR,
    ...partial,
  };
}

describe("GeneralUtils", () => {
  describe("arrayReverse", () => {
    it("reverses an array of primitives", () => {
      expect(arrayReverse([1, 2, 3])).toEqual([3, 2, 1]);
      expect(arrayReverse(["a", "b", "c"])).toEqual(["c", "b", "a"]);
    });

    it("reverses an array of services", () => {
      const a = makeService({ id: "a" });
      const b = makeService({ id: "b" });
      const c = makeService({ id: "c" });

      expect(arrayReverse([a, b, c]).map((s) => s.id)).toEqual(["c", "b", "a"]);
    });

    it("reverses the output of a DataQueries function", () => {
      const pos = makeService({ id: "pos", credit: 120 });
      const neg = makeService({ id: "neg", credit: -60 });
      const zero = makeService({ id: "zero", credit: 0 });

      const ascending = sortServicesByCreditAscending([pos, zero, neg]);
      expect(arrayReverse(ascending).map((s) => s.id)).toEqual([
        "pos",
        "zero",
        "neg",
      ]);
    });

    it("does not mutate the input array", () => {
      const input = [1, 2, 3];

      arrayReverse(input);

      expect(input).toEqual([1, 2, 3]);
    });

    it("returns an empty array for an empty input", () => {
      expect(arrayReverse([])).toEqual([]);
    });
  });
});
