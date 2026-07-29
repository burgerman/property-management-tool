import React from 'react';
import { BuildingStats } from '../types';
import { Users, ShieldCheck, Home, DollarSign, PieChart, Layers } from 'lucide-react';

interface BuildingStatsBannerProps {
  stats: BuildingStats;
}

export const BuildingStatsBanner: React.FC<BuildingStatsBannerProps> = ({ stats }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 pb-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Occupancy Rate */}
        <div className="glass-panel rounded-2xl p-3.5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Occupancy Rate</span>
            <PieChart className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
              {stats.occupancyRate}%
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.occupancyRate}%` }}
              ></div>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">
            {stats.occupiedRooms + stats.securedRooms} / {stats.totalRooms} rooms filled
          </p>
        </div>

        {/* Total Suites & Rooms */}
        <div className="glass-panel rounded-2xl p-3.5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Building Layout</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
              {stats.totalSuites} <span className="text-xs font-normal text-slate-400">Suites</span>
            </div>
            <p className="text-xs font-semibold text-blue-400 mt-0.5">
              19 Floors <span className="text-slate-500">(3–21)</span>
            </p>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">
            {stats.totalRooms} total rentable rooms
          </p>
        </div>

        {/* Occupied Suites (Yellow) */}
        <div className="glass-panel rounded-2xl p-3.5 border border-amber-500/20 bg-amber-950/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-amber-300">
            <span>Occupied Suites</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold text-amber-400 tracking-tight font-['Space_Grotesk']">
              {stats.occupiedSuitesCount}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {stats.occupiedRooms} active tenants
            </p>
          </div>
          <div className="flex items-center gap-1 mt-1.5 text-[10px] text-amber-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>Occupied</span>
          </div>
        </div>

        {/* Secured Suites (Green) */}
        <div className="glass-panel rounded-2xl p-3.5 border border-emerald-500/20 bg-emerald-950/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-emerald-300">
            <span>Secured Suites</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold text-emerald-400 tracking-tight font-['Space_Grotesk']">
              {stats.securedSuitesCount}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {stats.securedRooms} signed / pending
            </p>
          </div>
          <div className="flex items-center gap-1 mt-1.5 text-[10px] text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Secured</span>
          </div>
        </div>

        {/* Vacant Suites (Red) */}
        <div className="glass-panel rounded-2xl p-3.5 border border-rose-500/20 bg-rose-950/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-rose-300">
            <span>Vacant Suites</span>
            <Home className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold text-rose-400 tracking-tight font-['Space_Grotesk']">
              {stats.vacantSuitesCount}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {stats.vacantRooms} vacant rooms
            </p>
          </div>
          <div className="flex items-center gap-1 mt-1.5 text-[10px] text-rose-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            <span>Vacant</span>
          </div>
        </div>

        {/* Monthly Rent Total */}
        <div className="glass-panel rounded-2xl p-3.5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Monthly Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
              ${stats.totalMonthlyRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-emerald-400 font-medium mt-0.5">
              Collected / Mo
            </p>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">
            Across active leases
          </p>
        </div>
      </div>
    </div>
  );
};
