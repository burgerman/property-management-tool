import React from 'react';
import { Room, Suite, TenantRecord } from '../types';
import { X, Bed, ShieldCheck, UserCheck, AlertCircle, DollarSign, Calendar, Mail, Phone, ChevronRight } from 'lucide-react';
import { formatYear } from '../utils/formatters';

interface SuiteDetailModalProps {
  suite: Suite | null;
  onClose: () => void;
  onSelectTenant: (tenant: TenantRecord, room: Room) => void;
}

export const SuiteDetailModal: React.FC<SuiteDetailModalProps> = ({
  suite,
  onClose,
  onSelectTenant,
}) => {
  if (!suite) return null;

  const { suiteId, floorNumber, totalRooms, rooms, status, occupiedCount, securedCount, vacantCount, totalRent } = suite;

  // Status color styles
  let statusBadgeBg = '';
  let statusText = '';
  let StatusIcon = AlertCircle;

  if (status === 'vacant') {
    statusBadgeBg = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    statusText = 'Vacant Suite';
    StatusIcon = AlertCircle;
  } else if (status === 'secured') {
    statusBadgeBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    statusText = 'Secured Suite';
    StatusIcon = ShieldCheck;
  } else {
    statusBadgeBg = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    statusText = 'Occupied Suite';
    StatusIcon = UserCheck;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div
        className="glass-panel w-full max-w-2xl rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-extrabold text-xl font-['Space_Grotesk']">
              {suiteId}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                  Suite {suiteId}
                </h2>
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadgeBg}`}
                >
                  <StatusIcon className="w-3.5 h-3.5" />
                  <span>{statusText}</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span>Floor {floorNumber}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-indigo-400" />
                  {totalRooms} Bedroom Suite
                </span>
                {totalRent > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold flex items-center">
                      <DollarSign className="w-3 h-3" />
                      {totalRent.toLocaleString()} / mo
                    </span>
                  </>
                )}
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

        {/* Modal Body: Room Breakdown */}
        <div className="p-6 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-200 uppercase tracking-wider">
              Room Breakdown ({rooms.length} Rooms)
            </span>
            <span>
              {occupiedCount} Occupied • {securedCount} Secured • {vacantCount} Vacant
            </span>
          </div>

          {rooms.map((room) => {
            const isVacant = room.status === 'vacant';
            const tenant = room.tenant;
            const startYear = tenant ? formatYear(tenant.leaseStartDate) : '';
            const endYear = tenant ? formatYear(tenant.leaseEndDate) : '';
            const leaseYears = startYear && endYear ? `${startYear} - ${endYear}` : (startYear || endYear);

            return (
              <div
                key={room.roomId}
                onClick={() => {
                  if (tenant) {
                    onSelectTenant(tenant, room);
                  }
                }}
                className={`p-4 rounded-2xl border transition-all ${
                  isVacant
                    ? 'bg-rose-950/20 border-rose-500/20 text-rose-300'
                    : room.status === 'secured'
                    ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-400 cursor-pointer group'
                    : 'bg-amber-950/20 border-amber-500/30 hover:border-amber-400 cursor-pointer group'
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* Room Number & Badge */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center text-sm ${
                        isVacant
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : room.status === 'secured'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      #{room.roomNumber}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          {room.roomId}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                            isVacant
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              : room.status === 'secured'
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                          }`}
                        >
                          {isVacant ? 'Vacant Room' : room.status === 'secured' ? 'Secured' : 'Occupied'}
                        </span>
                      </div>

                      {tenant ? (
                        <div className="text-xs text-slate-300 mt-1 font-medium flex items-center gap-3">
                          <span className="text-white font-semibold text-sm">
                            {tenant.name}
                          </span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400">ID: {tenant.tenantId}</span>
                        </div>
                      ) : (
                        <p className="text-xs text-rose-400/80 mt-0.5">
                          Currently unassigned / Available for lease
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right side info / action */}
                  <div className="flex items-center gap-3 text-right">
                    {tenant ? (
                      <div>
                        <div className="text-sm font-bold text-emerald-400">
                          ${tenant.rent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[10px] font-normal text-slate-400">/mo</span>
                        </div>
                        {leaseYears && (
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 justify-end mt-0.5">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            {leaseYears}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 italic">No Active Lease</span>
                    )}

                    {tenant && (
                      <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400 group-hover:text-white group-hover:bg-indigo-600 transition-all">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub details if tenant */}
                {tenant && (
                  <div className="mt-3 pt-2.5 border-t border-white/5 grid grid-cols-2 gap-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      {tenant.email || 'No email registered'}
                    </span>
                    <span className="flex items-center gap-1.5 justify-end truncate">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      {tenant.phone || 'No phone registered'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all"
          >
            Close Suite Overview
          </button>
        </div>
      </div>
    </div>
  );
};
