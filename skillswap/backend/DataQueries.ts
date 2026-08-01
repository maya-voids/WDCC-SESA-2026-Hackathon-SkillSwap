// Query helpers for Service data. All functions are pure: they never mutate
// the input array and each returns a new array, so they're safe to chain
// with the retrieval functions in ./DataUtils.ts.
import {
  CITY,
  EDUCATIONTYPE,
  SERVICETAGS,
  SERVICETYPE,
  type Service,
} from "./DataUtils";

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

/** Any value from the Service-related enums in DataUtils. */
export type ServiceEnumValue =
  | SERVICETYPE
  | SERVICETAGS
  | CITY
  | EDUCATIONTYPE;

/**
 * Keep only the services that match an enum value. The kind of match depends
 * on which enum the value comes from:
 *   - SERVICETYPE   → service.type === value
 *   - SERVICETAGS   → value is one of service.tags
 *   - CITY          → service.location === value
 *   - EDUCATIONTYPE → service.eduType === value
 * e.g. filterServicesByEnumValue(services, SERVICETAGS.WEB_DEVELOPMENT)
 * returns every service tagged "Web Development".
 */
export function filterServicesByEnumValue(
  services: Service[],
  enumValue: ServiceEnumValue,
): Service[] {
  // EDUCATIONTYPE is the only numeric enum, so a number means an education type.
  if (typeof enumValue === "number") {
    return services.filter((service) => service.eduType === enumValue);
  }

  const serviceTypeValues = Object.values(SERVICETYPE) as string[];
  if (serviceTypeValues.includes(enumValue)) {
    return services.filter((service) => service.type === enumValue);
  }

  const cityValues = Object.values(CITY) as string[];
  if (cityValues.includes(enumValue)) {
    return services.filter((service) => service.location === enumValue);
  }

  // Not a number, SERVICETYPE, or CITY value, so it must be a SERVICETAGS value.
  return services.filter((service) =>
    service.tags.includes(enumValue as SERVICETAGS),
  );
}
