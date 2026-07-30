import { BuildingStats, Floor } from '../types';
import { formatCurrency } from './formatters';

export interface ReportExportOptions {
  reportTitle: string;
  format: 'pdf' | 'doc';
  includeSummary: boolean;
  includeOccupancyCards: boolean;
  includeSuiteBreakdown: boolean;
  includeFloorTable: boolean;
  floorRange: string; // 'all' | 'upper' | 'mid' | 'lower'
  dataSourceName?: string;
}

/**
 * Filter floors based on selected range
 */
function getFilteredFloors(floors: Floor[], range: string): Floor[] {
  return floors.filter((f) => {
    if (range === 'upper') return f.floorNumber >= 15;
    if (range === 'mid') return f.floorNumber >= 9 && f.floorNumber <= 14;
    if (range === 'lower') return f.floorNumber <= 8;
    return true;
  });
}

/**
 * Generate formatted HTML report content for PDF print or Word DOC export
 */
export function generateReportHtml(
  stats: BuildingStats,
  floors: Floor[],
  options: ReportExportOptions
): string {
  const {
    reportTitle,
    includeSummary,
    includeOccupancyCards,
    includeSuiteBreakdown,
    includeFloorTable,
    floorRange,
    dataSourceName,
  } = options;

  const targetFloors = getFilteredFloors(floors, floorRange);
  const generatedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const vacantRoomPct = Math.round((stats.vacantRooms / stats.totalRooms) * 100);
  const occupiedRoomPct = Math.round((stats.occupiedRooms / stats.totalRooms) * 100);
  const securedRoomPct = Math.round((stats.securedRooms / stats.totalRooms) * 100);

  return `
<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>${reportTitle}</title>
  <style>
    @page { size: A4 portrait; margin: 20mm; }
    body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 24px; background: #ffffff; font-size: 13px; line-height: 1.5; }
    .report-header { border-bottom: 2px solid #4f46e5; padding-bottom: 16px; margin-bottom: 24px; }
    .report-title { font-size: 24px; font-weight: 800; color: #1e1b4b; margin: 0 0 6px 0; font-family: sans-serif; }
    .report-meta { font-size: 12px; color: #64748b; margin: 0; }
    .section-title { font-size: 16px; font-weight: 700; color: #1e293b; margin: 24px 0 12px 0; border-left: 4px solid #4f46e5; padding-left: 10px; }
    .grid-4 { display: table; width: 100%; table-layout: fixed; margin-bottom: 20px; }
    .grid-cell { display: table-cell; width: 25%; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; vertical-align: top; }
    .metric-value { font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 4px; }
    .metric-label { font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; }
    .status-card { padding: 16px; border-radius: 8px; margin-bottom: 12px; border: 1px solid #e2e8f0; }
    .vacant-bg { background: #fff1f2; border-color: #fecdd3; }
    .occupied-bg { background: #fffbeb; border-color: #fef3c7; }
    .secured-bg { background: #ecfdf5; border-color: #a7f3d0; }
    .text-vacant { color: #e11d48; font-weight: bold; }
    .text-occupied { color: #d97706; font-weight: bold; }
    .text-secured { color: #059669; font-weight: bold; }
    table.data-table { width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 24px; }
    table.data-table th { background: #0f172a; color: #ffffff; font-weight: 600; padding: 10px 12px; text-align: left; font-size: 11px; }
    table.data-table td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
    table.data-table tr:nth-child(even) { background: #f8fafc; }
    .footer { margin-top: 40px; pt-4; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; }
    @media print {
      body { padding: 0; background: none; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="report-header">
    <h1 class="report-title">${reportTitle}</h1>
    <p class="report-meta">
      Generated on ${generatedDate} • Data Source: <strong>${dataSourceName || 'Property Building Dataset'}</strong> • Scope: <strong>Floors ${floorRange.toUpperCase()}</strong>
    </p>
  </div>

  ${
    includeSummary
      ? `
    <h2 class="section-title">1. Executive Summary & Revenue Overview</h2>
    <div class="grid-4">
      <div class="grid-cell" style="margin-right: 8px;">
        <div class="metric-label">Occupancy Rate</div>
        <div class="metric-value" style="color: #4f46e5;">${stats.occupancyRate}%</div>
        <div style="font-size: 11px; color: #64748b;">${stats.occupiedRooms + stats.securedRooms} of ${stats.totalRooms} rooms</div>
      </div>
      <div class="grid-cell">
        <div class="metric-label">Monthly Revenue</div>
        <div class="metric-value" style="color: #059669;">${formatCurrency(stats.totalMonthlyRevenue)}</div>
        <div style="font-size: 11px; color: #64748b;">Active leases total</div>
      </div>
      <div class="grid-cell">
        <div class="metric-label">Average Rent / Room</div>
        <div class="metric-value">${formatCurrency(stats.averageRoomRent)}</div>
        <div style="font-size: 11px; color: #64748b;">Per filled unit</div>
      </div>
      <div class="grid-cell">
        <div class="metric-label">Building Scale</div>
        <div class="metric-value">${stats.totalSuites} Suites</div>
        <div style="font-size: 11px; color: #64748b;">${stats.totalRooms} Rentable rooms</div>
      </div>
    </div>
  `
      : ''
  }

  ${
    includeOccupancyCards
      ? `
    <h2 class="section-title">2. Key Occupancy Status Facets</h2>
    <table style="width: 100%; border-collapse: separate; border-spacing: 12px; margin-left: -12px; margin-right: -12px;">
      <tr>
        <td style="width: 33%; vertical-align: top;" class="status-card vacant-bg">
          <div style="font-size: 14px; font-weight: 700;" class="text-vacant">Vacant Units (Red)</div>
          <div style="font-size: 24px; font-weight: 800; color: #9f1239; margin: 8px 0;">${stats.vacantSuitesCount} Suites</div>
          <div style="font-size: 12px; color: #881337;">${stats.vacantRooms} vacant rooms (${vacantRoomPct}% vacancy rate)</div>
        </td>
        <td style="width: 33%; vertical-align: top;" class="status-card occupied-bg">
          <div style="font-size: 14px; font-weight: 700;" class="text-occupied">Occupied Units (Yellow)</div>
          <div style="font-size: 24px; font-weight: 800; color: #92400e; margin: 8px 0;">${stats.occupiedSuitesCount} Suites</div>
          <div style="font-size: 12px; color: #78350f;">${stats.occupiedRooms} active resident tenants (${occupiedRoomPct}% rate)</div>
        </td>
        <td style="width: 33%; vertical-align: top;" class="status-card secured-bg">
          <div style="font-size: 14px; font-weight: 700;" class="text-secured">Secured Units (Green)</div>
          <div style="font-size: 24px; font-weight: 800; color: #065f46; margin: 8px 0;">${stats.securedSuitesCount} Suites</div>
          <div style="font-size: 12px; color: #064e3b;">${stats.securedRooms} signed / pending move-in (${securedRoomPct}% rate)</div>
        </td>
      </tr>
    </table>
  `
      : ''
  }

  ${
    includeSuiteBreakdown
      ? `
    <h2 class="section-title">3. Suite Bedroom Layout Distribution</h2>
    <table class="data-table">
      <thead>
        <tr>
          <th>Bedroom Layout Type</th>
          <th>Total Suites</th>
          <th>Total Rooms</th>
          <th>Occupied Suites</th>
          <th>Secured Suites</th>
          <th>Vacant Suites</th>
          <th>Occupancy Rate</th>
        </tr>
      </thead>
      <tbody>
        ${stats.suiteTypeBreakdowns
          .map(
            (b) => `
          <tr>
            <td><strong>${b.type}</strong></td>
            <td>${b.totalSuites}</td>
            <td>${b.totalRooms}</td>
            <td class="text-occupied">${b.occupiedSuites}</td>
            <td class="text-secured">${b.securedSuites}</td>
            <td class="text-vacant">${b.vacantSuites}</td>
            <td><strong>${b.occupancyRate}%</strong></td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  `
      : ''
  }

  ${
    includeFloorTable
      ? `
    <h2 class="section-title">4. Floor-by-Floor Statistical Breakdown (${targetFloors.length} Floors)</h2>
    <table class="data-table">
      <thead>
        <tr>
          <th>Floor Level</th>
          <th>Total Suites</th>
          <th>Total Rooms</th>
          <th>Occupied Rooms</th>
          <th>Secured Rooms</th>
          <th>Vacant Rooms</th>
          <th>Floor Occupancy Rate</th>
        </tr>
      </thead>
      <tbody>
        ${targetFloors
          .map((f) => {
            const totalFilled = f.occupiedRooms + f.securedRooms;
            const occRate = Math.round((totalFilled / f.totalRooms) * 100);
            return `
            <tr>
              <td><strong>Floor ${f.floorNumber}</strong></td>
              <td>${f.suites.length} Suites</td>
              <td>${f.totalRooms} Rooms</td>
              <td class="text-occupied">${f.occupiedRooms}</td>
              <td class="text-secured">${f.securedRooms}</td>
              <td class="text-vacant">${f.vacantRooms}</td>
              <td><strong>${occRate}%</strong></td>
            </tr>
          `;
          })
          .join('')}
      </tbody>
    </table>
  `
      : ''
  }

  <div class="footer">
    Property Management Analytics System • Official Statistics Report Export
  </div>
</body>
</html>
  `;
}

/**
 * Execute report download based on user selected options
 */
export function exportReport(
  stats: BuildingStats,
  floors: Floor[],
  options: ReportExportOptions
) {
  const htmlContent = generateReportHtml(stats, floors, options);
  const cleanFilename = (options.reportTitle || 'Statistics_Report')
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase();

  if (options.format === 'doc') {
    // Export Word .doc file using Blob
    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cleanFilename}_${Date.now()}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    // Export PDF via Print Window popup
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();

      // Trigger print after styles render
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } else {
      alert('Pop-up blocked! Please allow pop-ups for this site to generate PDF reports.');
    }
  }
}
