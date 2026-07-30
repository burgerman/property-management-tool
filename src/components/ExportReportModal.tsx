import React, { useState } from 'react';
import { BuildingStats, Floor } from '../types';
import { exportReport, ReportExportOptions } from '../utils/exportReport';
import { X, FileText, Download, CheckSquare, Square, FileType, Filter, CheckCircle2 } from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: BuildingStats;
  floors: Floor[];
  activeFloorRange: string;
  dataSourceName?: string;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  stats,
  floors,
  activeFloorRange,
  dataSourceName,
}) => {
  const [reportTitle, setReportTitle] = useState('Building Occupancy & Statistics Report');
  const [format, setFormat] = useState<'pdf' | 'doc'>('pdf');
  const [floorRange, setFloorRange] = useState<string>(activeFloorRange || 'all');

  // Facet Selection States
  const [includeSummary, setIncludeSummary] = useState(true);
  const [includeOccupancyCards, setIncludeOccupancyCards] = useState(true);
  const [includeSuiteBreakdown, setIncludeSuiteBreakdown] = useState(true);
  const [includeFloorTable, setIncludeFloorTable] = useState(true);

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const allSelected = includeSummary && includeOccupancyCards && includeSuiteBreakdown && includeFloorTable;

  const handleSelectAll = (select: boolean) => {
    setIncludeSummary(select);
    setIncludeOccupancyCards(select);
    setIncludeSuiteBreakdown(select);
    setIncludeFloorTable(select);
  };

  const handleExport = () => {
    const options: ReportExportOptions = {
      reportTitle,
      format,
      includeSummary,
      includeOccupancyCards,
      includeSuiteBreakdown,
      includeFloorTable,
      floorRange,
      dataSourceName,
    };

    exportReport(stats, floors, options);
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div
        className="glass-panel w-full max-w-xl rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                Export Statistics Report
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Generate offline PDF or Word doc reports without re-uploading workbook files
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            aria-label="Close export modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Report Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Report Document Title
            </label>
            <input
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              placeholder="e.g. Q3 Building Occupancy Report"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Export File Format Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Select Export File Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  format === 'pdf'
                    ? 'bg-rose-500/10 border-rose-500/50 text-rose-300 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileType className="w-5 h-5 text-rose-400" />
                  <div>
                    <div className="font-bold text-xs text-white">PDF Document (.pdf)</div>
                    <div className="text-[10px] text-slate-400">Printable & ready for PDF save</div>
                  </div>
                </div>
                {format === 'pdf' && <span className="w-2 h-2 rounded-full bg-rose-400"></span>}
              </button>

              <button
                type="button"
                onClick={() => setFormat('doc')}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  format === 'doc'
                    ? 'bg-blue-500/10 border-blue-500/50 text-blue-300 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="font-bold text-xs text-white">Word Document (.doc)</div>
                    <div className="text-[10px] text-slate-400">Editable in MS Word / Pages</div>
                  </div>
                </div>
                {format === 'doc' && <span className="w-2 h-2 rounded-full bg-blue-400"></span>}
              </button>
            </div>
          </div>

          {/* Select Dimensions/Facets to Include */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Select Report Statistics Facets
              </label>
              <button
                type="button"
                onClick={() => handleSelectAll(!allSelected)}
                className="text-[11px] font-semibold text-indigo-400 hover:underline"
              >
                {allSelected ? 'Deselect All' : 'Select All Facets'}
              </button>
            </div>

            <div className="space-y-2">
              {/* Facet 1: Executive Summary */}
              <div
                onClick={() => setIncludeSummary(!includeSummary)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  includeSummary
                    ? 'bg-indigo-500/10 border-indigo-500/30 text-white'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  {includeSummary ? (
                    <CheckSquare className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500" />
                  )}
                  <div>
                    <div className="font-semibold text-xs text-slate-200">1. Executive Summary & Revenue Overview</div>
                    <div className="text-[10px] text-slate-400">Revenue, average rent, total rooms, occupancy rate</div>
                  </div>
                </div>
              </div>

              {/* Facet 2: Occupancy Status Cards */}
              <div
                onClick={() => setIncludeOccupancyCards(!includeOccupancyCards)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  includeOccupancyCards
                    ? 'bg-indigo-500/10 border-indigo-500/30 text-white'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  {includeOccupancyCards ? (
                    <CheckSquare className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500" />
                  )}
                  <div>
                    <div className="font-semibold text-xs text-slate-200">2. Key Occupancy Status Cards</div>
                    <div className="text-[10px] text-slate-400">Vacant (Red), Occupied (Yellow), Secured (Green) metrics</div>
                  </div>
                </div>
              </div>

              {/* Facet 3: Suite Bedroom Layout Breakdown */}
              <div
                onClick={() => setIncludeSuiteBreakdown(!includeSuiteBreakdown)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  includeSuiteBreakdown
                    ? 'bg-indigo-500/10 border-indigo-500/30 text-white'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  {includeSuiteBreakdown ? (
                    <CheckSquare className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500" />
                  )}
                  <div>
                    <div className="font-semibold text-xs text-slate-200">3. Suite Bedroom Layout Breakdown</div>
                    <div className="text-[10px] text-slate-400">Distribution across 5-Bed, 4-Bed, and 3-Bed layouts</div>
                  </div>
                </div>
              </div>

              {/* Facet 4: Floor-by-Floor Table */}
              <div
                onClick={() => setIncludeFloorTable(!includeFloorTable)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  includeFloorTable
                    ? 'bg-indigo-500/10 border-indigo-500/30 text-white'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  {includeFloorTable ? (
                    <CheckSquare className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500" />
                  )}
                  <div>
                    <div className="font-semibold text-xs text-slate-200">4. Floor-by-Floor Breakdown Table</div>
                    <div className="text-[10px] text-slate-400">Detailed room counts & rates table per floor level</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scope Floor Range Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              <span>Floor Scope Range</span>
            </label>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {[
                { id: 'all', label: 'All (3–21)' },
                { id: 'upper', label: 'Upper (15–21)' },
                { id: 'mid', label: 'Mid (9–14)' },
                { id: 'lower', label: 'Lower (3–8)' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setFloorRange(r.id)}
                  className={`py-2 px-2 rounded-xl text-center font-semibold transition-all border ${
                    floorRange === r.id
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {downloadSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center gap-2 font-semibold animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Report successfully generated & downloading!</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
          >
            Cancel
          </button>

          <button
            disabled={!includeSummary && !includeOccupancyCards && !includeSuiteBreakdown && !includeFloorTable}
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Generate & Download {format.toUpperCase()} Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
