import React from 'react';
import { ActiveTab } from '../types';
import { Building2, PieChart, FileSpreadsheet, RefreshCw, Upload, Download, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onRefresh: () => void;
  onOpenUpload: () => void;
  onDownloadSample: () => void;
  isCustomData: boolean;
  fileName?: string;
  lastRefreshed: Date;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onRefresh,
  onOpenUpload,
  onDownloadSample,
  isCustomData,
  fileName,
  lastRefreshed,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 sm:px-8 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: App Logo & Data Source Indicator */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-500 shadow-lg shadow-indigo-500/20 text-white">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white font-['Space_Grotesk']">
                Property Visualizer
              </h1>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Floors 3–21
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Workbook:</span>
              <span className="text-slate-200 font-medium truncate max-w-[200px]">
                {isCustomData ? fileName || 'Uploaded Workbook' : 'Pre-loaded Demo File'}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">
                {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </p>
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <nav className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 self-center md:self-auto">
          <button
            onClick={() => setActiveTab('layout')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'layout'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Building Layout</span>
          </button>

          <button
            onClick={() => setActiveTab('statistics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'statistics'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Statistics</span>
          </button>

          <button
            onClick={() => setActiveTab('excel')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'excel'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel Data</span>
          </button>
        </nav>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2">
          {/* Refresh Data Button */}
          <button
            onClick={onRefresh}
            title="Refresh Excel data source"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all hover:border-slate-600 active:scale-95 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Upload Excel Button */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all active:scale-95"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Excel</span>
          </button>

          {/* Export Sample Button */}
          <button
            onClick={onDownloadSample}
            title="Download sample Excel template (.xlsx)"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden lg:inline">Export Sample</span>
          </button>
        </div>
      </div>
    </header>
  );
};
