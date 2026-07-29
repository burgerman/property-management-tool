import React, { useState } from 'react';
import { BuildingStats, Floor } from '../types';
import { PieChart, Home, Users, ShieldCheck, DollarSign, Layers, ArrowUpRight, Filter, CheckCircle2 } from 'lucide-react';

interface StatisticsViewProps {
  stats: BuildingStats;
  floors: Floor[];
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({ stats, floors }) => {
  const [selectedFloorRange, setSelectedFloorRange] = useState<string>('all');

  // Compute percentages
  const vacantSuitePct = Math.round((stats.vacantSuitesCount / stats.totalSuites) * 100);
  const occupiedSuitePct = Math.round((stats.occupiedSuitesCount / stats.totalSuites) * 100);
  const securedSuitePct = Math.round((stats.securedSuitesCount / stats.totalSuites) * 100);

  const vacantRoomPct = Math.round((stats.vacantRooms / stats.totalRooms) * 100);
  const occupiedRoomPct = Math.round((stats.occupiedRooms / stats.totalRooms) * 100);
  const securedRoomPct = Math.round((stats.securedRooms / stats.totalRooms) * 100);

  // Filter floors for table
  const filteredFloors = floors.filter((f) => {
    if (selectedFloorRange === 'upper') return f.floorNumber >= 15;
    if (selectedFloorRange === 'mid') return f.floorNumber >= 9 && f.floorNumber <= 14;
    if (selectedFloorRange === 'lower') return f.floorNumber <= 8;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <PieChart className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white font-['Space_Grotesk'] tracking-tight">
              Building Analytics & Statistics
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Comprehensive occupancy stats, suite status distributions, and floor-by-floor breakdown for property management.
          </p>
        </div>

        {/* Quick Filter */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
          <span className="text-slate-400 font-medium">Floors:</span>
          <button
            onClick={() => setSelectedFloorRange('all')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              selectedFloorRange === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All (3–21)
          </button>
          <button
            onClick={() => setSelectedFloorRange('upper')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              selectedFloorRange === 'upper' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Upper (15–21)
          </button>
          <button
            onClick={() => setSelectedFloorRange('mid')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              selectedFloorRange === 'mid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Mid (9–14)
          </button>
          <button
            onClick={() => setSelectedFloorRange('lower')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              selectedFloorRange === 'lower' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Lower (3–8)
          </button>
        </div>
      </div>

      {/* 3 Key Occupancy Status Cards (Vacant, Occupied, Secured) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Vacant Units Card (Red) */}
        <div className="glass-panel rounded-3xl p-6 border border-rose-500/30 bg-rose-950/20 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm font-['Space_Grotesk']">
              <Home className="w-5 h-5 text-rose-400" />
              <span>Vacant Units</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {vacantSuitePct}% of Suites
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <div className="text-4xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
                {stats.vacantSuitesCount} <span className="text-sm font-semibold text-slate-400">Suites</span>
              </div>
              <p className="text-xs text-rose-300 font-medium mt-1">
                {stats.vacantRooms} vacant rooms
              </p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-rose-400 font-['Space_Grotesk']">
                {vacantRoomPct}%
              </div>
              <p className="text-[10px] text-slate-400">Room Vacancy Rate</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-900/80 h-2.5 rounded-full mt-4 overflow-hidden border border-slate-800">
            <div
              className="bg-rose-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${vacantRoomPct}%` }}
            ></div>
          </div>
        </div>

        {/* Occupied Units Card (Yellow) */}
        <div className="glass-panel rounded-3xl p-6 border border-amber-500/30 bg-amber-950/20 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm font-['Space_Grotesk']">
              <Users className="w-5 h-5 text-amber-400" />
              <span>Occupied Units</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {occupiedSuitePct}% of Suites
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <div className="text-4xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
                {stats.occupiedSuitesCount} <span className="text-sm font-semibold text-slate-400">Suites</span>
              </div>
              <p className="text-xs text-amber-300 font-medium mt-1">
                {stats.occupiedRooms} active tenants
              </p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-amber-400 font-['Space_Grotesk']">
                {occupiedRoomPct}%
              </div>
              <p className="text-[10px] text-slate-400">Room Occupancy Rate</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-900/80 h-2.5 rounded-full mt-4 overflow-hidden border border-slate-800">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${occupiedRoomPct}%` }}
            ></div>
          </div>
        </div>

        {/* Secured Units Card (Green) */}
        <div className="glass-panel rounded-3xl p-6 border border-emerald-500/30 bg-emerald-950/20 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm font-['Space_Grotesk']">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Secured Units</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {securedSuitePct}% of Suites
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <div className="text-4xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
                {stats.securedSuitesCount} <span className="text-sm font-semibold text-slate-400">Suites</span>
              </div>
              <p className="text-xs text-emerald-300 font-medium mt-1">
                {stats.securedRooms} signed / pending
              </p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-emerald-400 font-['Space_Grotesk']">
                {securedRoomPct}%
              </div>
              <p className="text-[10px] text-slate-400">Secured Leases Rate</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-900/80 h-2.5 rounded-full mt-4 overflow-hidden border border-slate-800">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${securedRoomPct}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Financial & Room Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Monthly Revenue</p>
            <div className="text-2xl font-extrabold text-white font-['Space_Grotesk'] mt-1">
              ${stats.totalMonthlyRevenue.toLocaleString()}
            </div>
            <p className="text-[10px] text-emerald-400 font-medium mt-0.5">Active Leases Revenue</p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Average Rent / Room</p>
            <div className="text-2xl font-extrabold text-white font-['Space_Grotesk'] mt-1">
              ${stats.averageRoomRent.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Per occupied room</p>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Building Rooms</p>
            <div className="text-2xl font-extrabold text-white font-['Space_Grotesk'] mt-1">
              {stats.totalRooms}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Across {stats.totalSuites} suites</p>
          </div>
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Overall Occupancy Rate</p>
            <div className="text-2xl font-extrabold text-indigo-400 font-['Space_Grotesk'] mt-1">
              {stats.occupancyRate}%
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Occupied + Secured Rooms</p>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Suite Bedroom Type Distribution */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
          <span>Suite Bedroom Layout Breakdown</span>
          <span className="text-xs text-slate-400 font-normal">(5-Bed, 4-Bed, and 3-Bed Layouts)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.suiteTypeBreakdowns.map((bt) => (
            <div key={bt.type} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm font-['Space_Grotesk']">
                  {bt.type}
                </span>
                <span className="text-xs font-bold text-indigo-400">
                  {bt.occupancyRate}% Occupied
                </span>
              </div>

              <div className="text-xs text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Total Suites:</span>
                  <span className="text-white font-semibold">{bt.totalSuites} Suites ({bt.totalRooms} Rooms)</span>
                </div>
                <div className="flex justify-between">
                  <span>Occupied Suites:</span>
                  <span className="text-amber-400 font-semibold">{bt.occupiedSuites} Suites</span>
                </div>
                <div className="flex justify-between">
                  <span>Secured Suites:</span>
                  <span className="text-emerald-400 font-semibold">{bt.securedSuites} Suites</span>
                </div>
                <div className="flex justify-between">
                  <span>Vacant Suites:</span>
                  <span className="text-rose-400 font-semibold">{bt.vacantSuites} Suites</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full"
                  style={{ width: `${bt.occupancyRate}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floor-by-Floor Statistical Breakdown Table */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
              Floor-by-Floor Occupancy Breakdown
            </h3>
            <p className="text-xs text-slate-400">
              Detailed room counts and status distribution per floor level (Floors {filteredFloors[filteredFloors.length - 1]?.floorNumber} to {filteredFloors[0]?.floorNumber})
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Floor Level</th>
                <th className="py-3 px-4">Total Suites</th>
                <th className="py-3 px-4">Total Rooms</th>
                <th className="py-3 px-4 text-amber-400">Occupied Rooms</th>
                <th className="py-3 px-4 text-emerald-400">Secured Rooms</th>
                <th className="py-3 px-4 text-rose-400">Vacant Rooms</th>
                <th className="py-3 px-4">Occupancy Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
              {filteredFloors.map((floor) => {
                const totalFilled = floor.occupiedRooms + floor.securedRooms;
                const occRate = Math.round((totalFilled / floor.totalRooms) * 100);

                let badgeColor = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
                if (occRate === 100) badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                else if (occRate < 50) badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';

                return (
                  <tr key={floor.floorNumber} className="hover:bg-slate-900/60 transition-all">
                    <td className="py-3 px-4 font-bold text-white font-['Space_Grotesk']">
                      Floor {floor.floorNumber}
                    </td>
                    <td className="py-3 px-4">6 Suites</td>
                    <td className="py-3 px-4">{floor.totalRooms} Rooms</td>
                    <td className="py-3 px-4 font-semibold text-amber-300">{floor.occupiedRooms}</td>
                    <td className="py-3 px-4 font-semibold text-emerald-300">{floor.securedRooms}</td>
                    <td className="py-3 px-4 font-semibold text-rose-300">{floor.vacantRooms}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full font-bold border ${badgeColor}`}>
                          {occRate}%
                        </span>
                        <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="bg-indigo-500 h-full rounded-full"
                            style={{ width: `${occRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
