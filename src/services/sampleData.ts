import { TenantRecord } from '../types';
import { MAX_FLOOR, MIN_FLOOR, SUITE_BEDROOM_MAP, formatFloor } from '../utils/buildingLayout';

const FIRST_NAMES = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Sam', 'Riley', 'Jamie', 'Avery', 'Dakota',
  'John', 'Alice', 'David', 'Emma', 'Michael', 'Sophia', 'James', 'Olivia', 'William', 'Ava',
  'Benjamin', 'Isabella', 'Lucas', 'Mia', 'Henry', 'Charlotte', 'Alexander', 'Amelia', 'Ethan', 'Harper',
  'Mason', 'Evelyn', 'Daniel', 'Abigail', 'Jacob', 'Emily', 'Logan', 'Elizabeth', 'Jackson', 'Mila',
  'Levi', 'Ella', 'Sebastian', 'Avery', 'Mateo', 'Sofia', 'Jack', 'Camila', 'Owen', 'Aria',
];

const LAST_NAMES = [
  'Smith', 'Brown', 'Lee', 'Johnson', 'Williams', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez',
  'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson',
  'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis',
  'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill',
];

const EMAIL_DOMAINS = ['gmail.com', 'outlook.com', 'yahoo.com', 'university.edu', 'company.io', 'icloud.com'];

/**
 * Generate a deterministic set of realistic demo tenants for floors 3-21
 */
export function generateSampleTenants(): TenantRecord[] {
  const tenants: TenantRecord[] = [];
  let tenantIdCounter = 100240;

  for (let f = MIN_FLOOR; f <= MAX_FLOOR; f++) {
    const floorStr = formatFloor(f);

    for (const [suiteIdx, bedroomCount] of Object.entries(SUITE_BEDROOM_MAP)) {
      const suiteId = `${floorStr}${suiteIdx}`;
      const suiteNum = parseInt(suiteIdx, 10);

      // Deterministic occupancy pattern to ensure all 3 statuses exist across the building:
      // Suite 03 on certain floors is 100% vacant (Red)
      // Suite 06 on certain floors is Secured (Green)
      // Most other suites are Occupied (Yellow) or partially occupied
      const isVacantSuite = (f % 5 === 0 && suiteNum === 3) || (f === 7 && suiteNum === 1) || (f === 14 && suiteNum === 4);
      const isSecuredSuite = (f % 4 === 0 && suiteNum === 6) || (f === 11 && suiteNum === 2);

      if (isVacantSuite) {
        // Skip adding tenants for vacant suite
        continue;
      }

      for (let r = 1; r <= bedroomCount; r++) {
        // Leave room 3 or 5 vacant in some occupied suites
        if (!isSecuredSuite && (r === 3 && suiteNum % 2 === 0) && f % 2 === 1) {
          continue;
        }

        tenantIdCounter++;
        const fnIdx = (f * 7 + suiteNum * 3 + r * 5) % FIRST_NAMES.length;
        const lnIdx = (f * 11 + suiteNum * 2 + r * 3) % LAST_NAMES.length;
        const domainIdx = (f + r) % EMAIL_DOMAINS.length;

        const firstName = FIRST_NAMES[fnIdx];
        const lastName = LAST_NAMES[lnIdx];
        const tenantId = `T${tenantIdCounter}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${r}@${EMAIL_DOMAINS[domainIdx]}`;
        const phone = `555-${(100 + (f * 3 + r) % 899).toString()}-${(1000 + (tenantIdCounter % 8999)).toString()}`;
        const birthYear = 1992 + ((f * 3 + r * 7) % 12); // Ages ~22-34
        const baseRent = 850.50 + (f * 15.25) + (r * 25.75);
        const rent = Number(baseRent.toFixed(2));

        const startYear = 2025;
        const startMonth = ((f + r) % 12) + 1;
        const leaseStart = `${startYear}-${startMonth.toString().padStart(2, '0')}-01`;
        const leaseEnd = `${startYear + 1}-${startMonth.toString().padStart(2, '0')}-31`;

        const status = isSecuredSuite ? 'Future' : (r === 2 && f % 3 === 0) ? 'Notice' : 'Current';

        tenants.push({
          unit: `${suiteId}-${r}`,
          tenantId,
          name: `${firstName} ${lastName}`,
          email,
          phone,
          birthYear,
          rent,
          leaseStartDate: leaseStart,
          leaseEndDate: leaseEnd,
          status,
        });
      }
    }
  }

  return tenants;
}
