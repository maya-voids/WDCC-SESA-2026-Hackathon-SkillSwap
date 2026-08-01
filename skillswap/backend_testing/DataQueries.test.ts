import { describe, expect, it } from "vitest";
import {
  filterServicesByCredit,
  sortServicesByCreditAscending,
  sortServicesByEduTypeAscending,
  sortServicesByTimeAscending,
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

describe("DataQueries", () => {
  describe("sortServicesByTimeAscending", () => {
    it("sorts earliest time first", () => {
      const a = makeService({ id: "a", time: "2026-08-09T00:00:00.000Z" });
      const b = makeService({ id: "b", time: "2026-08-01T00:00:00.000Z" });
      const c = makeService({ id: "c", time: "2026-08-05T00:00:00.000Z" });

      expect(
        sortServicesByTimeAscending([a, b, c]).map((s) => s.id),
      ).toEqual(["b", "c", "a"]);
    });
  });

  describe("sortServicesByEduTypeAscending", () => {
    it("sorts by the EDUCATIONTYPE index order (first, second, graduate)", () => {
      const first = makeService({
        id: "first",
        eduType: EDUCATIONTYPE.FIRST_YEAR,
      });
      const grad = makeService({
        id: "grad",
        eduType: EDUCATIONTYPE.GRADUATE,
      });
      const second = makeService({
        id: "second",
        eduType: EDUCATIONTYPE.SECOND_YEAR,
      });

      expect(
        sortServicesByEduTypeAscending([grad, first, second]).map((s) => s.id),
      ).toEqual(["first", "second", "grad"]);
    });
  });

  describe("sortServicesByCreditAscending", () => {
    it("sorts most negative credit first", () => {
      const pos = makeService({ id: "pos", credit: 120 });
      const neg = makeService({ id: "neg", credit: -60 });
      const zero = makeService({ id: "zero", credit: 0 });

      expect(
        sortServicesByCreditAscending([pos, zero, neg]).map((s) => s.id),
      ).toEqual(["neg", "zero", "pos"]);
    });
  });

  describe("filterServicesByCredit", () => {
    it("keeps only services with credit at least minCredit", () => {
      const pos = makeService({ id: "pos", credit: 120 });
      const neg = makeService({ id: "neg", credit: -60 });
      const zero = makeService({ id: "zero", credit: 0 });

      expect(
        filterServicesByCredit([pos, neg, zero], 0).map((s) => s.id),
      ).toEqual(["pos", "zero"]);
    });
  });
});
