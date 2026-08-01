import { describe, expect, it } from "vitest";
import { arrayReverse, intersection } from "../backend/GeneralUtils";
import {
  filterServicesByCredit,
  sortServicesByCreditAscending,
} from "../backend/DataQueries";
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

  describe("intersection", () => {
    it("keeps only items present in both arrays", () => {
      expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
      expect(intersection(["a", "b"], ["b", "c"])).toEqual(["b"]);
    });

    it("returns an empty array when there is no overlap", () => {
      expect(intersection([1, 2], [3, 4])).toEqual([]);
    });

    it("preserves the order of the first array", () => {
      expect(intersection([3, 1, 2], [2, 3])).toEqual([3, 2]);
    });

    it("deduplicates the result", () => {
      expect(intersection([1, 1, 2, 2], [1, 2])).toEqual([1, 2]);
    });

    it("does not mutate either input array", () => {
      const a = [1, 2, 3];
      const b = [2, 3, 4];
      const aCopy = [...a];
      const bCopy = [...b];

      intersection(a, b);

      expect(a).toEqual(aCopy);
      expect(b).toEqual(bCopy);
    });

    it("matches objects by key", () => {
      const a = makeService({ id: "a" });
      const b = makeService({ id: "b" });
      const aAgain = makeService({ id: "a", title: "duplicate" });

      expect(
        intersection([a, b], [aAgain], (s) => s.id).map((s) => s.id),
      ).toEqual(["a"]);
    });

    it("combines the outputs of two DataQueries functions", () => {
      const pos = makeService({ id: "pos", credit: 120 });
      const neg = makeService({ id: "neg", credit: -60 });
      const zero = makeService({ id: "zero", credit: 0 });

      const sorted = sortServicesByCreditAscending([pos, zero, neg]); // neg, zero, pos
      const qualifying = filterServicesByCredit([pos, zero, neg], 0); // pos, zero

      expect(
        intersection(sorted, qualifying, (s) => s.id).map((s) => s.id),
      ).toEqual(["zero", "pos"]);
    });
  });
});
