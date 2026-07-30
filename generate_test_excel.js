import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIRST_NAMES = [
  'John', 'Alice', 'David', 'Emma', 'Michael', 'Sophia', 'James', 'Olivia', 'William', 'Ava',
  'Benjamin', 'Isabella', 'Lucas', 'Mia', 'Henry', 'Charlotte', 'Alexander', 'Amelia', 'Ethan', 'Harper',
  'Mason', 'Evelyn', 'Daniel', 'Abigail', 'Jacob', 'Emily', 'Logan', 'Elizabeth', 'Jackson', 'Mila',
  'Liam', 'Noah', 'Oliver', 'Elijah', 'Mateo', 'Sebastian', 'James', 'Ezra', 'Luca', 'Leo',
];

const LAST_NAMES = [
  'Smith', 'Brown', 'Lee', 'Johnson', 'Williams', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez',
  'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson',
  'Martin', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
];

const SUITE_BEDROOM_MAP = {
  '01': 4,
  '02': 5,
  '03': 3,
  '04': 3,
  '05': 5,
  '06': 4,
};

function generateTestData() {
  const rows = [];
  let tenantCounter = 100100;

  const EXCLUDED_FLOORS = [13];
  const EXCLUDED_SUITES = ['0304'];

  // Generate rows for floors 3 through 21
  for (let f = 3; f <= 21; f++) {
    if (EXCLUDED_FLOORS.includes(f)) continue;

    const floorStr = f.toString().padStart(2, '0');

    for (const [suiteIdx, bedroomCount] of Object.entries(SUITE_BEDROOM_MAP)) {
      const suiteNum = parseInt(suiteIdx, 10);
      const suiteId = `${floorStr}${suiteIdx}`;

      if (EXCLUDED_SUITES.includes(suiteId)) continue;

      // Leave some suites vacant (Red) for testing:
      // Floor 5 Suite 03, Floor 8 Suite 01, Floor 12 Suite 04, Floor 17 Suite 03, Floor 20 Suite 06
      const isVacantSuite =
        (f === 5 && suiteNum === 3) ||
        (f === 8 && suiteNum === 1) ||
        (f === 12 && suiteNum === 4) ||
        (f === 17 && suiteNum === 3) ||
        (f === 20 && suiteNum === 6);

      if (isVacantSuite) {
        // Skip generating tenant rows so suite is 100% vacant (Red)
        continue;
      }

      // Mark some suites as Secured (Green):
      // Floor 4 Suite 06, Floor 9 Suite 02, Floor 14 Suite 05, Floor 19 Suite 01
      const isSecuredSuite =
        (f === 4 && suiteNum === 6) ||
        (f === 9 && suiteNum === 2) ||
        (f === 14 && suiteNum === 5) ||
        (f === 19 && suiteNum === 1);

      for (let r = 1; r <= bedroomCount; r++) {
        // Leave room 3 vacant in some occupied suites
        if (!isSecuredSuite && r === 3 && (f + suiteNum) % 3 === 0) {
          continue;
        }

        tenantCounter++;
        const fn = FIRST_NAMES[(f * 5 + suiteNum * 3 + r * 2) % FIRST_NAMES.length];
        const ln = LAST_NAMES[(f * 7 + suiteNum * 2 + r * 5) % LAST_NAMES.length];
        const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${f}${r}@management-test.com`;
        const phone = `555-${(200 + (f * 7 + r * 3) % 700).toString()}-${(1000 + (tenantCounter % 8999)).toString()}`;
        const birthYear = 1993 + ((f + r * 2) % 12);
        const rent = Number((850.50 + f * 20.25 + r * 30.75).toFixed(2));
        // Status logic aligned with new unit color rules:
        // - Vacant (Red): T-Code and Name empty OR Status 'Notice'
        // - Occupied (Yellow): T-Code and Name not empty AND Status 'Current'
        // - Secured (Green): T-Code/Name present AND Status 'Future'
        let status = 'Current';
        if (isSecuredSuite) {
          status = 'Future';
        } else if (r === 2 && (f + suiteNum) % 4 === 0) {
          status = 'Notice';
        }

        const month = ((f + r) % 12) + 1;
        const monthStr = month.toString().padStart(2, '0');
        const leaseStart = `2025-${monthStr}-01`;
        const leaseEnd = `2026-${monthStr}-31`;

        rows.push({
          'Unit': `${suiteId}-${r}`,
          'T-Code': `T${tenantCounter}`,
          'Name': `${fn} ${ln}`,
          'Email': email,
          'Phone': phone,
          'Birth Year': birthYear,
          'Rent': rent,
          'Lease Start Date': leaseStart,
          'Lease End Date': leaseEnd,
          'Status': status,
        });
      }
    }
  }

  // Add explicit test rows for empty T-Code & Name vacant units
  rows.push({
    'Unit': '0503-1',
    'T-Code': '',
    'Name': '',
    'Email': '',
    'Phone': '',
    'Birth Year': '',
    'Rent': 0,
    'Lease Start Date': '',
    'Lease End Date': '',
    'Status': '',
  });

  return rows;
}

const data = generateTestData();

const worksheet = XLSX.utils.json_to_sheet(data);

// Formatting column widths
worksheet['!cols'] = [
  { wch: 12 }, // Unit
  { wch: 14 }, // T-Code
  { wch: 22 }, // Name
  { wch: 32 }, // Email
  { wch: 16 }, // Phone
  { wch: 12 }, // Birth Year
  { wch: 12 }, // Rent
  { wch: 18 }, // Lease Start Date
  { wch: 18 }, // Lease End Date
  { wch: 14 }, // Status
];

const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Building Tenants');

const outputPath = path.join(__dirname, 'building_tenants_test_data.xlsx');
XLSX.writeFile(workbook, outputPath);

console.log(`Successfully generated Excel test file at: ${outputPath}`);
console.log(`Total tenant records generated: ${data.length}`);
