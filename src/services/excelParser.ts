import * as XLSX from 'xlsx';
import { ExcelParseResult, TenantRecord } from '../types';
import { parseUnitId } from '../utils/buildingLayout';
import { formatDate, formatYear, getErrorMessage } from '../utils/formatters';

/**
 * Flexible column key normalization helper
 */
function normalizeHeader(headerStr: string): string {
  return headerStr
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Parse uploaded Excel file buffer into TenantRecord list
 */
export async function parseExcelFile(file: File): Promise<ExcelParseResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const tenants: TenantRecord[] = [];

  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array', cellDates: true });

    if (!workbook.SheetNames.length) {
      return { tenants: [], errors: ['Excel file contains no sheets.'], warnings: [], totalRowsProcessed: 0 };
    }

    // Read the first worksheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convert sheet to JSON rows
    const rawRows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

    if (!rawRows || rawRows.length === 0) {
      return { tenants: [], errors: ['Excel sheet is empty.'], warnings: [], totalRowsProcessed: 0 };
    }

    let processedCount = 0;

    rawRows.forEach((row, index) => {
      processedCount++;
      const rowNum = index + 2; // 1-indexed header is row 1

      // Map headers dynamically
      const rowMap: Record<string, unknown> = {};
      Object.keys(row).forEach((key) => {
        rowMap[normalizeHeader(key)] = row[key];
      });

      // Find unit column
      const unitVal =
        rowMap['unit'] ||
        rowMap['unitnumber'] ||
        rowMap['room'] ||
        rowMap['roomnumber'] ||
        rowMap['unitid'] ||
        '';

      const unitStr = String(unitVal).trim();

      if (!unitStr) {
        warnings.push(`Row ${rowNum}: Skipped because 'Unit' is missing.`);
        return;
      }

      const parsedUnit = parseUnitId(unitStr);
      if (!parsedUnit) {
        warnings.push(`Row ${rowNum}: Invalid room identifier '${unitStr}'. Expected valid format like '0301-4' or '2105-5' (Floors 3-21, Suites 01-06).`);
        return;
      }

      const tenantIdVal =
        rowMap['tcode'] ||
        rowMap['tenantid'] ||
        rowMap['tenant'] ||
        rowMap['id'] ||
        '';
      const tenantId = String(tenantIdVal).trim();

      const nameVal =
        rowMap['name'] ||
        rowMap['tenantname'] ||
        rowMap['fullname'] ||
        '';
      const name = String(nameVal).trim();

      const email = String(
        rowMap['email'] || rowMap['emailaddress'] || ''
      ).trim();

      const phone = String(
        rowMap['phone'] || rowMap['phonenumber'] || rowMap['mobile'] || ''
      ).trim();

      const birthYearRaw = rowMap['birthyear'] || rowMap['birth'] || rowMap['dobyear'] || 1995;
      const birthYear = parseInt(String(birthYearRaw), 10) || 1995;

      const rentRaw = rowMap['rent'] || rowMap['monthlyrent'] || rowMap['rentamount'] || rowMap['rentprice'] || 0;
      const rent = parseFloat(String(rentRaw).replace(/[^0-9.]/g, '')) || 0;

      const leaseStart = formatYear(
        rowMap['leasestartdate'] || rowMap['leasestart'] || rowMap['startdate'],
        '2025-09-01'
      );

      const leaseEnd = formatYear(
        rowMap['leaseenddate'] || rowMap['leaseend'] || rowMap['enddate'],
        '2026-08-31'
      );

      const statusVal =
        rowMap['status'] ||
        rowMap['moveinstatus'] ||
        rowMap['occupancystatus'] ||
        '';
      const status = String(statusVal).trim();

      // Store all original key-value pairs from the row for dynamic display
      const extraFields: Record<string, unknown> = {};
      Object.keys(row).forEach((originalKey) => {
        const val = row[originalKey];
        if (val !== undefined && val !== null && val !== '') {
          if (val instanceof Date) {
            extraFields[originalKey] = formatYear(val);
          } else {
            extraFields[originalKey] = val;
          }
        }
      });

      tenants.push({
        unit: `${parsedUnit.suiteId}-${parsedUnit.roomNumber}`,
        tenantId,
        name,
        email,
        phone,
        birthYear,
        rent,
        leaseStartDate: leaseStart,
        leaseEndDate: leaseEnd,
        status,
        extraFields,
      });
    });

    return {
      tenants,
      errors,
      warnings,
      totalRowsProcessed: processedCount,
    };
  } catch (err: unknown) {
    return {
      tenants: [],
      errors: [`Failed to parse Excel file: ${getErrorMessage(err)}`],
      warnings: [],
      totalRowsProcessed: 0,
    };
  }
}

/**
 * Generate and download an Excel file populated with tenant records
 */
export function exportSampleExcel(tenants: TenantRecord[]) {
  const exportData = tenants.map((t) => ({
    'Unit': t.unit,
    'T-Code': t.tenantId,
    'Name': t.name,
    'Email': t.email,
    'Phone': t.phone,
    'Birth Year': t.birthYear,
    'Rent': t.rent,
    'Lease Start Date': t.leaseStartDate,
    'Lease End Date': t.leaseEndDate,
    'Status': t.status || 'Current',
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Set column widths for nice appearance
  worksheet['!cols'] = [
    { wch: 10 }, // Unit
    { wch: 12 }, // Tenant ID
    { wch: 20 }, // Name
    { wch: 26 }, // Email
    { wch: 15 }, // Phone
    { wch: 12 }, // Birth Year
    { wch: 10 }, // Rent
    { wch: 16 }, // Lease Start
    { wch: 16 }, // Lease End
    { wch: 12 }, // Status
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Tenants');

  XLSX.writeFile(workbook, 'Building_Tenants_Data.xlsx');
}
