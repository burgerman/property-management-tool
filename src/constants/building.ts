/**
 * Building structural layout and configuration constants
 */

export const MIN_FLOOR = 3;
export const MAX_FLOOR = 21;

/**
 * Floors physically omitted/excluded from the building structure (e.g. 13th floor skipped)
 */
export const EXCLUDED_FLOORS: number[] = [13];

/**
 * Specific suite IDs physically omitted/excluded from the building structure (e.g. Suite 0304)
 */
export const EXCLUDED_SUITES: string[] = ['0304'];

/**
 * All valid physical floor numbers in the building
 */
export const VALID_FLOORS: number[] = Array.from(
  { length: MAX_FLOOR - MIN_FLOOR + 1 },
  (_, i) => MAX_FLOOR - i
).filter((f) => !EXCLUDED_FLOORS.includes(f));

export const TOTAL_FLOORS = VALID_FLOORS.length; // 18 Physical Floors (excluding 13)

/**
 * Bedroom capacity map by suite suffix code (01 through 06)
 */
export const SUITE_BEDROOM_MAP: Record<string, number> = {
  '01': 4,
  '02': 5,
  '03': 3,
  '04': 3,
  '05': 5,
  '06': 4,
};

export const TOTAL_SUITES_PER_FLOOR = Object.keys(SUITE_BEDROOM_MAP).length; // 6 Suites per floor

export const TOTAL_ROOMS_PER_FLOOR = Object.values(SUITE_BEDROOM_MAP).reduce((sum, count) => sum + count, 0); // 24 Rooms per floor
