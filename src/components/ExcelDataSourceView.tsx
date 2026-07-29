import React, { useState } from 'react';
import { ExcelParseResult, TenantRecord } from '../types';
import { parseExcelFile } from '../services/excelParser';
import { FileSpreadsheet, Upload, Download, Search, RefreshCw, CheckCircle2, FileText } from 'lucide-react';

interface ExcelDataSourceViewProps {
  tenants: TenantRecord[];
  isCustomData: boolean;
  fileName?: string;
  lastRefreshed: Date;
  onDataLoaded: (result: ExcelParseResult, fileName: string) => void;
  onDownloadSample: () => void;
  onRefresh: () => void;
}

export const ExcelDataSourceView: React.FC<ExcelDataSourceViewProps> = ({
  tenants,
  isCustomData,
  fileName,
  lastRefreshed,
  onDataLoaded,
  onDownloadSample,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      alert('Please select a valid Excel file (.xlsx, .xls) or CSV file.');
      return;
    }

    setIsLoading(true);
    setUploadNotice(null);
    try {
      const result = await parseExcelFile(file);
      onDataLoaded(result, file.name);
      setUploadNotice(`Successfully loaded ${result.tenants.length} tenant records from '${file.name}'.`);
    } catch (err: any) {
      alert(`Error parsing Excel file: ${err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Filter tenants table by search query
  const filteredTenants = tenants.filter((t) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      t.unit.toLowerCase().includes(term) ||
      t.name.toLowerCase().includes(term) ||
      t.tenantId.toLowerCase().includes(term) ||
      t.email.toLowerCase().includes(term) ||
      (t.status || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white font-['Space_Grotesk'] tracking-tight">
              Excel Data Source
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Upload custom Excel workbooks (.xlsx, .csv) and inspect parsed tenant records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Refresh Data</span>
          </button>

          <button
            onClick={onDownloadSample}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Sample</span>
          </button>
        </div>
      </div>

      {/* Main Drag & Drop Excel Uploader Card */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`glass-panel rounded-3xl p-8 border-2 border-dashed transition-all text-center relative ${
          isDragging
            ? 'border-emerald-500 bg-emerald-500/10'
            : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
        }`}
      >
        <input
          type="file"
          id="excel-tab-file-input"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />

        <label htmlFor="excel-tab-file-input" className="cursor-pointer block">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-4 shadow-xl">
            <Upload className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
            {isLoading ? 'Processing File...' : 'Upload Excel File'}
          </h3>

          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Drag and drop your Excel file (<code className="text-emerald-300">.xlsx</code>, <code className="text-emerald-300">.csv</code>) here, or click to browse.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-all">
            <Upload className="w-3.5 h-3.5" />
            <span>Select File</span>
          </div>
        </label>

        {uploadNotice && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center gap-2 font-medium max-w-lg mx-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{uploadNotice}</span>
          </div>
        )}
      </div>

      {/* Current Workbook Status Overview */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                Active File: {isCustomData ? fileName : 'Pre-loaded Demo Data'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Status: <span className="text-emerald-400 font-semibold">Active</span> • Refreshed at {lastRefreshed.toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-semibold">
              {tenants.length} Rows
            </span>
          </div>
        </div>
      </div>

      {/* Searchable Raw Excel Tenants Data Table */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
              Tenant Records ({filteredTenants.length})
            </h3>
            <p className="text-xs text-slate-400">
              Parsed rows from active file
            </p>
          </div>

          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Unit, Name, ID, Email..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 max-h-[500px]">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 font-semibold sticky top-0 z-10 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Unit</th>
                <th className="py-3 px-4">T-Code</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Rent</th>
                <th className="py-3 px-4">Lease Start</th>
                <th className="py-3 px-4">Lease End</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/40 font-mono">
              {filteredTenants.length > 0 ? (
                filteredTenants.map((t, idx) => (
                  <tr key={`${t.unit}-${idx}`} className="hover:bg-slate-900/60 transition-all font-sans">
                    <td className="py-2.5 px-4 font-bold text-indigo-300 font-mono">{t.unit}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-400">{t.tenantId}</td>
                    <td className="py-2.5 px-4 font-semibold text-white">{t.name}</td>
                    <td className="py-2.5 px-4 text-slate-400">{t.email || '-'}</td>
                    <td className="py-2.5 px-4 text-slate-400">{t.phone || '-'}</td>
                    <td className="py-2.5 px-4 font-semibold text-emerald-400">${t.rent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="py-2.5 px-4 text-slate-400">{t.leaseStartDate || '-'}</td>
                    <td className="py-2.5 px-4 text-slate-400">{t.leaseEndDate || '-'}</td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {t.status || 'Occupied'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 font-sans">
                    No tenant records match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
