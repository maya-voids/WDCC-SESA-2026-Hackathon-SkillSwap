// Query helpers for Service data. All functions are pure: they never mutate
// the input array and each returns a new array, so they're safe to chain
// with the retrieval functions in ./DataUtils.ts.
import { type Service } from "./DataUtils";

/** Sort services by their UTC `time` field ascending (earliest first). */
export function sortServicesByTimeAscending(services: Service[]): Service[] {
  return [...services].sort(
    (a, b) => Date.parse(a.time) - Date.parse(b.time),
  );
}

/**
 * Sort services by ascending education type, following the numbered index
 * order of the EDUCATIONTYPE enum (FIRST_YEAR = 1, SECOND_YEAR = 2,
 * GRADUATE = 3).
 */
export function sortServicesByEduTypeAscending(
  services: Service[],
): Service[] {
  return [...services].sort((a, b) => a.eduType - b.eduType);
}

/** Sort services by credit value ascending (most negative first). */
export function sortServicesByCreditAscending(services: Service[]): Service[] {
  return [...services].sort((a, b) => a.credit - b.credit);
}

/** Keep only the services whose credit value is at least `minCredit`. */
export function filterServicesByCredit(
  services: Service[],
  minCredit: number,
): Service[] {
  return services.filter((service) => service.credit >= minCredit);
}
