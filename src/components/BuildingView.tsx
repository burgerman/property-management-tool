import React, { useState } from 'react';
import { Floor, Suite } from '../types';
import { FloorView } from './FloorView';
import { Search, Building, ArrowUp, ArrowDown } from 'lucide-react';

interface BuildingViewProps {
  floors: Floor[];
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  onSuiteClick: (suite: Suite) => void;
  onRoomClick?: (suite: Suite, roomId: string) => void;
}

export const BuildingView: React.FC<BuildingViewProps> = ({
  floors,
  statusFilter,
  setStatusFilter,
  onSuiteClick,
  onRoomClick,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter floors/suites based on search query
  const filteredFloors = floors.map((floor) => {
    if (!searchTerm.trim()) return floor;

    const term = searchTerm.toLowerCase().trim();
    const matchingSuites = floor.suites.filter((suite) => {
      const suiteMatch = suite.suiteId.toLowerCase().includes(term);
      const roomMatch = suite.rooms.some((r) => r.roomId.toLowerCase().includes(term) || (r.tenant?.name || '').toLowerCase().includes(term));
      return suiteMatch || roomMatch;
    });

    return {
      ...floor,
      suites: matchingSuites,
    };
  }).filter((floor) => floor.suites.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
      {/* Search & Status Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
              Building Elevation Overview
            </h2>
            <p className="text-xs text-slate-400">
              Floors 21 (Penthouse) down to 3 (Bottom) • Click any suite card for room details
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Status Filter Pills */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                statusFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Suites
            </button>
            <button
              onClick={() => setStatusFilter('vacant')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                statusFilter === 'vacant'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              Vacant
            </button>
            <button
              onClick={() => setStatusFilter('occupied')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                statusFilter === 'occupied'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Occupied
            </button>
            <button
              onClick={() => setStatusFilter('secured')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                statusFilter === 'secured'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Secured
            </button>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Suite or Tenant..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Top of Building Indicator */}
      <div className="flex items-center justify-center gap-2 py-2 mb-4 rounded-xl bg-indigo-950/20 border border-indigo-500/10 text-indigo-300 text-xs font-semibold tracking-wider uppercase">
        <ArrowUp className="w-4 h-4 text-indigo-400" />
        <span>Penthouse & Upper Floors (Floor 21)</span>
      </div>

      {/* Floors List */}
      <div className="space-y-4">
        {filteredFloors.length > 0 ? (
          filteredFloors.map((floor) => (
            <FloorView
              key={floor.floorNumber}
              floor={floor}
              statusFilter={statusFilter}
              onSuiteClick={onSuiteClick}
              onRoomClick={onRoomClick}
            />
          ))
        ) : (
          <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800">
            <Building className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-300 font-['Space_Grotesk']">
              No matching suites found
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Try adjusting your search query or reset the filter settings to view building suites.
            </p>
          </div>
        )}
      </div>

      {/* Bottom of Building Indicator */}
      <div className="flex items-center justify-center gap-2 py-2 mt-6 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-semibold tracking-wider uppercase">
        <ArrowDown className="w-4 h-4 text-slate-400" />
        <span>Lower Residential Floors (Floor 3)</span>
      </div>
    </div>
  );
};
