export type SuiteStatus = 'vacant' | 'occupied' | 'secured';

export type RoomStatus = 'vacant' | 'occupied' | 'secured';

export type ActiveTab = 'layout' | 'statistics' | 'excel';

export interface TenantRecord {
  unit: string;           // e.g. "0301-1"
  tenantId: string;       // e.g. "T100245"
  name: string;           // e.g. "John Smith"
  email: string;          // e.g. "john@email.com"
  phone: string;          // e.g. "555-123-4567"
  birthYear: number;      // e.g. 1998
  rent: number;           // e.g. 950
  leaseStartDate: string; // e.g. "2025-09-01"
  leaseEndDate: string;   // e.g. "2026-08-31"
  status?: string;        // e.g. "Occupied" or "Secured"
  extraFields?: Record<string, unknown>; // Stores all dynamic raw key-value pairs from Excel row
}

export interface Room {
  roomId: string;         // e.g. "0301-1"
  roomNumber: number;     // e.g. 1
  status: RoomStatus;
  tenant?: TenantRecord;
}

export interface Suite {
  suiteId: string;        // e.g. "0301"
  floorNumber: number;    // e.g. 3
  suiteNumber: string;    // e.g. "01"
  totalRooms: number;     // 5, 4, or 3
  rooms: Room[];
  status: SuiteStatus;
  occupiedCount: number;
  securedCount: number;
  vacantCount: number;
  totalRent: number;
}

export interface Floor {
  floorNumber: number;    // 3 through 21
  suites: Suite[];
  totalRooms: number;
  occupiedRooms: number;
  vacantRooms: number;
  securedRooms: number;
}

export interface SuiteTypeBreakdown {
  type: string;           // e.g. "5 Bedrooms", "4 Bedrooms", "3 Bedrooms"
  bedroomCount: number;
  totalSuites: number;
  occupiedSuites: number;
  securedSuites: number;
  vacantSuites: number;
  totalRooms: number;
  occupiedRooms: number;
  occupancyRate: number;
}

export interface BuildingStats {
  totalFloors: number;
  totalSuites: number;
  totalRooms: number;
  occupiedRooms: number;
  securedRooms: number;
  vacantRooms: number;
  occupancyRate: number;
  totalMonthlyRevenue: number;
  averageRoomRent: number;
  vacantSuitesCount: number;
  occupiedSuitesCount: number;
  securedSuitesCount: number;
  suiteTypeBreakdowns: SuiteTypeBreakdown[];
}

export interface ExcelParseResult {
  tenants: TenantRecord[];
  errors: string[];
  warnings: string[];
  totalRowsProcessed: number;
}
