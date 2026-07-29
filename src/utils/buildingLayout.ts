import { BuildingStats, Floor, Room, Suite, SuiteStatus, RoomStatus, TenantRecord } from '../types';
import { MAX_FLOOR, MIN_FLOOR, SUITE_BEDROOM_MAP, EXCLUDED_FLOORS, EXCLUDED_SUITES, VALID_FLOORS } from '../constants/building';

export { MIN_FLOOR, MAX_FLOOR, SUITE_BEDROOM_MAP, EXCLUDED_FLOORS, EXCLUDED_SUITES, VALID_FLOORS };

/**
 * Parse a unit string like "0301-1" or "301-1" or "2105-3"
 */
export function parseUnitId(unitStr: string): { floorNumber: number; suiteId: string; roomNumber: number } | null {
  if (!unitStr) return null;

  const clean = unitStr.trim();
  const parts = clean.split('-');
  if (parts.length !== 2) return null;

  const suiteCode = parts[0]; // e.g. "0301" or "301" or "2105"
  const roomNum = parseInt(parts[1], 10);

  if (isNaN(roomNum) || roomNum < 1) return null;

  // Standardize suiteCode to 4 digits if 3 digits (e.g. "301" -> "0301")
  const paddedSuite = suiteCode.padStart(4, '0');

  // First 2 digits = floor, Last 2 digits = suite index (01-06)
  const floorNum = parseInt(paddedSuite.substring(0, 2), 10);
  const suiteIdx = paddedSuite.substring(2, 4);

  if (floorNum < MIN_FLOOR || floorNum > MAX_FLOOR) return null;
  if (EXCLUDED_FLOORS.includes(floorNum)) return null; // Reject units on excluded floors (e.g. 13th floor)
  if (EXCLUDED_SUITES.includes(paddedSuite)) return null; // Reject units in physically excluded suites (e.g. Suite 0304)
  if (!SUITE_BEDROOM_MAP[suiteIdx]) return null;

  const maxRooms = SUITE_BEDROOM_MAP[suiteIdx];
  if (roomNum > maxRooms) return null;

  return {
    floorNumber: floorNum,
    suiteId: paddedSuite,
    roomNumber: roomNum,
  };
}

/**
 * Format floor number into 2-digit string
 */
export function formatFloor(floorNum: number): string {
  return floorNum.toString().padStart(2, '0');
}

/**
 * Build complete building layout with tenant data mapped to rooms
 */
export function buildBuildingState(tenants: TenantRecord[]): { floors: Floor[]; stats: BuildingStats } {
  // Map tenants by unit ID for fast lookup (e.g. "0301-1")
  const tenantMap = new Map<string, TenantRecord>();
  tenants.forEach((tenant) => {
    if (!tenant.unit) return;
    const parsed = parseUnitId(tenant.unit);
    if (parsed) {
      const normalizedKey = `${parsed.suiteId}-${parsed.roomNumber}`;
      tenantMap.set(normalizedKey, tenant);
    }
  });

  const floors: Floor[] = [];

  let totalOccupiedRooms = 0;
  let totalSecuredRooms = 0;
  let totalVacantRooms = 0;
  let totalMonthlyRevenue = 0;
  let totalSuitesCount = 0;
  let vacantSuitesCount = 0;
  let occupiedSuitesCount = 0;
  let securedSuitesCount = 0;
  let totalRoomsCount = 0;

  // Build physical floors top-down using VALID_FLOORS array (excluding omitted floors like 13)
  for (const f of VALID_FLOORS) {
    const floorStr = formatFloor(f);
    const suites: Suite[] = [];
    let floorOccupied = 0;
    let floorSecured = 0;
    let floorVacant = 0;
    let floorRoomsCount = 0;

    for (const [suiteIdx, bedroomCount] of Object.entries(SUITE_BEDROOM_MAP)) {
      const suiteId = `${floorStr}${suiteIdx}`;

      // Skip physically excluded suites (e.g. Suite 0304)
      if (EXCLUDED_SUITES.includes(suiteId)) {
        continue;
      }

      const rooms: Room[] = [];
      let occupiedCount = 0;
      let securedCount = 0;
      let vacantCount = 0;
      let suiteRent = 0;

      for (let r = 1; r <= bedroomCount; r++) {
        const roomId = `${suiteId}-${r}`;
        const tenant = tenantMap.get(roomId);

        let roomStatus: RoomStatus = 'vacant';
        if (tenant) {
          suiteRent += tenant.rent || 0;
          totalMonthlyRevenue += tenant.rent || 0;
          const statusLower = (tenant.status || '').toLowerCase();
          if (statusLower.includes('secured') || statusLower.includes('pending') || statusLower.includes('signed')) {
            roomStatus = 'secured';
            securedCount++;
          } else {
            roomStatus = 'occupied';
            occupiedCount++;
          }
        } else {
          vacantCount++;
        }

        rooms.push({
          roomId,
          roomNumber: r,
          status: roomStatus,
          tenant,
        });
      }

      floorOccupied += occupiedCount;
      floorSecured += securedCount;
      floorVacant += vacantCount;
      floorRoomsCount += bedroomCount;

      let suiteStatus: SuiteStatus = 'vacant';
      if (occupiedCount > 0) {
        suiteStatus = 'occupied';
        occupiedSuitesCount++;
      } else if (securedCount > 0) {
        suiteStatus = 'secured';
        securedSuitesCount++;
      } else {
        suiteStatus = 'vacant';
        vacantSuitesCount++;
      }

      totalSuitesCount++;
      totalRoomsCount += bedroomCount;

      suites.push({
        suiteId,
        floorNumber: f,
        suiteNumber: suiteIdx,
        totalRooms: bedroomCount,
        rooms,
        status: suiteStatus,
        occupiedCount,
        securedCount,
        vacantCount,
        totalRent: suiteRent,
      });
    }

    totalOccupiedRooms += floorOccupied;
    totalSecuredRooms += floorSecured;
    totalVacantRooms += floorVacant;

    floors.push({
      floorNumber: f,
      suites,
      totalRooms: floorRoomsCount,
      occupiedRooms: floorOccupied,
      securedRooms: floorSecured,
      vacantRooms: floorVacant,
    });
  }

  const occupancyRate = totalRoomsCount > 0 ? Math.round(((totalOccupiedRooms + totalSecuredRooms) / totalRoomsCount) * 100) : 0;

  const totalOccupiedAndSecuredRooms = totalOccupiedRooms + totalSecuredRooms;
  const averageRoomRent = totalOccupiedAndSecuredRooms > 0 ? Math.round(totalMonthlyRevenue / totalOccupiedAndSecuredRooms) : 0;

  const bedroomTypes = [
    { type: '5-Bedroom Suites (01 & 06)', count: 5 },
    { type: '4-Bedroom Suites (02 & 05)', count: 4 },
    { type: '3-Bedroom Suites (03 & 04)', count: 3 },
  ];

  const suiteTypeBreakdowns = bedroomTypes.map((b) => {
    let typeTotalSuites = 0;
    let typeOccupiedSuites = 0;
    let typeSecuredSuites = 0;
    let typeVacantSuites = 0;
    let typeTotalRooms = 0;
    let typeOccupiedRooms = 0;

    floors.forEach((fl) => {
      fl.suites.forEach((st) => {
        if (st.totalRooms === b.count) {
          typeTotalSuites++;
          typeTotalRooms += st.totalRooms;
          typeOccupiedRooms += (st.occupiedCount + st.securedCount);

          if (st.status === 'occupied') typeOccupiedSuites++;
          else if (st.status === 'secured') typeSecuredSuites++;
          else typeVacantSuites++;
        }
      });
    });

    const occRate = typeTotalRooms > 0 ? Math.round((typeOccupiedRooms / typeTotalRooms) * 100) : 0;

    return {
      type: b.type,
      bedroomCount: b.count,
      totalSuites: typeTotalSuites,
      occupiedSuites: typeOccupiedSuites,
      securedSuites: typeSecuredSuites,
      vacantSuites: typeVacantSuites,
      totalRooms: typeTotalRooms,
      occupiedRooms: typeOccupiedRooms,
      occupancyRate: occRate,
    };
  });

  const stats: BuildingStats = {
    totalFloors: VALID_FLOORS.length,
    totalSuites: totalSuitesCount,
    totalRooms: totalRoomsCount,
    occupiedRooms: totalOccupiedRooms,
    securedRooms: totalSecuredRooms,
    vacantRooms: totalVacantRooms,
    occupancyRate,
    totalMonthlyRevenue,
    averageRoomRent,
    vacantSuitesCount,
    occupiedSuitesCount,
    securedSuitesCount,
    suiteTypeBreakdowns,
  };

  return { floors, stats };
}
