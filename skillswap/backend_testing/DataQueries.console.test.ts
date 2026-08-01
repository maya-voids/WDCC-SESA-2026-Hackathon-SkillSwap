// TEMPORARY demo — prints the output of each DataQueries function against the
// mock datasets. Delete after use.
import { readFileSync } from "node:fs";
import { describe, it } from "vitest";
import {
  filterServicesByCredit,
  sortServicesByCreditAscending,
  sortServicesByEduTypeAscending,
  sortServicesByTimeAscending,
} from "../backend/DataQueries";
import { educationTypeToLabel, type Service } from "../backend/DataUtils";

function load(path: string): Service[] {
  return JSON.parse(readFileSync(path, "utf8")) as Service[];
}

const line = "─".repeat(72);

function ids(list: Service[]): string {
  return list.map((s) => s.id).join(", ");
}

function print(set: Service[], label: string): void {
  console.log(`\n${line}`);
  console.log(`DATASET: ${label} (${set.length} items)`);
  console.log(`  id | time | eduType | credit`);
  set.forEach((s) => {
    console.log(
      `  ${s.id.padEnd(15)} | ${s.time} | ${String(s.eduType).padEnd(9)} (${educationTypeToLabel(s.eduType)}) | ${String(s.credit).padStart(4)}`,
    );
  });
}

describe("console demo", () => {
  it("logs DataQueries output on mock data", () => {
    const tasks = load("./backend/dataStorage/tasksMock.json");
    const events = load("./backend/dataStorage/eventsMock.json");
    const all = [...tasks, ...events];

    for (const [set, name] of [
      [tasks, "tasksMock"],
      [events, "eventsMock"],
      [all, "tasks + events combined"],
    ] as const) {
      print(set, name);
    }

    console.log(`\n${line}`);
    console.log("1) sortServicesByTimeAscending (earliest UTC time first)");
    console.log("   tasks  →", ids(sortServicesByTimeAscending(tasks)));
    console.log("   events →", ids(sortServicesByTimeAscending(events)));

    console.log(`\n2) sortServicesByEduTypeAscending (FIRST_YEAR=1 → GRADUATE=3)`);
    console.log("   tasks  →", ids(sortServicesByEduTypeAscending(tasks)));
    console.log("   events →", ids(sortServicesByEduTypeAscending(events)));

    console.log(`\n3) sortServicesByCreditAscending (most negative first)`);
    console.log("   tasks  →", ids(sortServicesByCreditAscending(tasks)));
    console.log("   events →", ids(sortServicesByCreditAscending(events)));

    console.log(`\n4) filterServicesByCredit(minCredit = 50)`);
    console.log("   tasks  →", ids(filterServicesByCredit(tasks, 50)));
    console.log("   events →", ids(filterServicesByCredit(events, 50)));
  });
});
