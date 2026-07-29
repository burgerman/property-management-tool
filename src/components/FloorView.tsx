import React from 'react';
import { Floor, Suite } from '../types';
import { SuiteCard } from './SuiteCard';
import { formatFloor } from '../utils/buildingLayout';
import { Layers } from 'lucide-react';

interface FloorViewProps {
  floor: Floor;
  statusFilter: string;
  onSuiteClick: (suite: Suite) => void;
  onRoomClick?: (suite: Suite, roomId: string) => void;
}

export const FloorView: React.FC<FloorViewProps> = ({
  floor,
  statusFilter,
  onSuiteClick,
  onRoomClick,
}) => {
  // Filter suites if a status filter is active
  const filteredSuites = floor.suites.filter((suite) => {
    if (statusFilter === 'all') return true;
    return suite.status === statusFilter;
  });

  if (statusFilter !== 'all' && filteredSuites.length === 0) {
    return null;
  }

  const floorLabel = `Floor ${formatFloor(floor.floorNumber)}`;
  const totalOccupiedAndSecured = floor.occupiedRooms + floor.securedRooms;
  const floorOccupancyPct = Math.round((totalOccupiedAndSecured / floor.totalRooms) * 100);

  return (
    <div
      id={`floor-${floor.floorNumber}`}
      className="glass-panel rounded-2xl p-4 border border-slate-800/80 shadow-md transition-all"
    >
      {/* Floor Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700/60 flex items-center justify-center text-indigo-400 font-bold text-sm">
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-['Space_Grotesk'] tracking-wide">
              {floorLabel}
            </h2>
            <p className="text-xs text-slate-400">
              6 Suites • {floor.totalRooms} Rooms
            </p>
          </div>
        </div>

        {/* Floor Occupancy Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {floor.securedRooms} Secured
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              {floor.occupiedRooms} Occupied
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              {floor.vacantRooms} Vacant
            </span>
          </div>

          <div className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
            {floorOccupancyPct}% Occupied
          </div>
        </div>
      </div>

      {/* 6 Suites Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {filteredSuites.map((suite) => (
          <SuiteCard
            key={suite.suiteId}
            suite={suite}
            onClick={onSuiteClick}
            onRoomClick={onRoomClick}
          />
        ))}
      </div>
    </div>
  );
};
