import React, { useState } from 'react';
import { ExcelParseResult } from '../types';
import { parseExcelFile } from '../services/excelParser';
import { X, Upload, FileSpreadsheet, AlertTriangle, CheckCircle2, HelpCircle, Download } from 'lucide-react';

interface ExcelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataLoaded: (result: ExcelParseResult, fileName: string) => void;
  onDownloadSample: () => void;
}

export const ExcelUploadModal: React.FC<ExcelUploadModalProps> = ({
  isOpen,
  onClose,
  onDataLoaded,
  onDownloadSample,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [parseResult, setParseResult] = useState<ExcelParseResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleFile = async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      alert('Please select a valid Excel file (.xlsx, .xls) or CSV file.');
      return;
    }

    setSelectedFile(file);
    setIsLoading(true);
    try {
      const result = await parseExcelFile(file);
      setParseResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleApplyData = () => {
    if (parseResult && selectedFile) {
      onDataLoaded(parseResult, selectedFile.name);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div
        className="glass-panel w-full max-w-2xl rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                Upload Tenant Excel Workbook
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Refresh building occupancy state from an external Excel file (.xlsx, .xls, .csv)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* File Drop Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
            }`}
          >
            <input
              type="file"
              id="excel-file-input"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
            <label htmlFor="excel-file-input" className="cursor-pointer">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3">
                <Upload className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                Drag & Drop your Excel workbook here
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                or click to browse your computer (.xlsx, .xls, .csv)
              </p>
            </label>
          </div>

          {/* Parse Result Summary */}
          {isLoading && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center text-sm text-slate-300">
              Parsing Excel sheet...
            </div>
          )}

          {parseResult && !isLoading && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Parse Complete: {parseResult.tenants.length} Valid Tenants Found
                </span>
                <span className="text-xs text-slate-400">
                  {parseResult.totalRowsProcessed} Total Rows Scanned
                </span>
              </div>

              {parseResult.warnings.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs space-y-1 max-h-32 overflow-y-auto">
                  <div className="font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Warnings ({parseResult.warnings.length}):
                  </div>
                  {parseResult.warnings.slice(0, 5).map((w, idx) => (
                    <p key={idx} className="text-[11px] text-amber-200/80">
                      • {w}
                    </p>
                  ))}
                  {parseResult.warnings.length > 5 && (
                    <p className="text-[10px] text-amber-400 font-semibold italic">
                      + {parseResult.warnings.length - 5} more warnings omitted
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Schema Reference Guide */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                Excel Workbook Column Schema
              </h4>

              <button
                onClick={onDownloadSample}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                Download Sample Excel Template
              </button>
            </div>

            <p className="text-xs text-slate-400">
              The parser maps room numbers automatically from the <code className="text-indigo-300">Unit</code> column (e.g. <code className="text-indigo-300">0301-4</code> or <code className="text-indigo-300">2105-5</code>).
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-1.5 px-2">Column Header</th>
                    <th className="py-1.5 px-2">Sample Value</th>
                    <th className="py-1.5 px-2">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr>
                    <td className="py-1 px-2 font-mono text-indigo-300">Unit</td>
                    <td className="py-1 px-2">0301-1</td>
                    <td className="py-1 px-2 text-slate-400">Room Identifier (Floor + Suite + Room)</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 font-mono text-indigo-300">T-Code</td>
                    <td className="py-1 px-2">T100245</td>
                    <td className="py-1 px-2 text-slate-400">Tenant ID code</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 font-mono text-indigo-300">Name</td>
                    <td className="py-1 px-2">John Smith</td>
                    <td className="py-1 px-2 text-slate-400">Full tenant name</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 font-mono text-indigo-300">Status</td>
                    <td className="py-1 px-2">Current / Future / Notice</td>
                    <td className="py-1 px-2 text-slate-400">Occupancy Status (Current = Yellow, Future = Green, Notice = Red)</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 font-mono text-indigo-300">Rent</td>
                    <td className="py-1 px-2">950</td>
                    <td className="py-1 px-2 text-slate-400">Monthly lease rate ($)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
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
            disabled={!parseResult || parseResult.tenants.length === 0}
            onClick={handleApplyData}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-md transition-all"
          >
            Apply Data to Building ({parseResult?.tenants.length || 0} Tenants)
          </button>
        </div>
      </div>
    </div>
  );
};
