import React from 'react';
import { Suite } from '../types';
import { Bed, UserCheck, ShieldCheck, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface SuiteCardProps {
  suite: Suite;
  onClick: (suite: Suite) => void;
  onRoomClick?: (suite: Suite, roomId: string) => void;
}

export const SuiteCard: React.FC<SuiteCardProps> = ({ suite, onClick, onRoomClick }) => {
  const { status, suiteId, totalRooms, occupiedCount, vacantCount, rooms, totalRent } = suite;

  let borderStyle = '';
  let bgStyle = '';
  let textBadgeStyle = '';
  let statusLabel = '';
  let StatusIcon = AlertCircle;

  if (status === 'vacant') {
    borderStyle = 'border-rose-500/40 hover:border-rose-400 group-hover:shadow-rose-900/20';
    bgStyle = 'bg-rose-950/30 hover:bg-rose-900/40';
    textBadgeStyle = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    statusLabel = 'Vacant';
    StatusIcon = AlertCircle;
  } else if (status === 'secured') {
    borderStyle = 'border-emerald-500/40 hover:border-emerald-400 group-hover:shadow-emerald-900/20';
    bgStyle = 'bg-emerald-950/30 hover:bg-emerald-900/40';
    textBadgeStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    statusLabel = 'Secured';
    StatusIcon = ShieldCheck;
  } else {
    borderStyle = 'border-amber-500/40 hover:border-amber-400 group-hover:shadow-amber-900/20';
    bgStyle = 'bg-amber-950/30 hover:bg-amber-900/40';
    textBadgeStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    statusLabel = 'Occupied';
    StatusIcon = UserCheck;
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(suite);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(suite)}
      onKeyDown={handleKeyDown}
      aria-label={`Suite ${suiteId}, ${totalRooms} bedrooms, status ${statusLabel}`}
      className={`group relative rounded-xl p-3.5 border transition-all duration-200 cursor-pointer shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 ${bgStyle} ${borderStyle}`}
    >
      {/* Suite Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-base tracking-wide text-white font-['Space_Grotesk']">
            {suiteId}
          </span>
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <Bed className="w-3 h-3 text-slate-400" />
            {totalRooms} Beds
          </span>
        </div>

        {/* Status Badge */}
        <div
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${textBadgeStyle}`}
        >
          <StatusIcon className="w-3 h-3" />
          <span>{statusLabel}</span>
        </div>
      </div>

      {/* Room Pill Dots */}
      <div className="mt-3 flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          {rooms.map((room) => {
            let dotBg = 'bg-slate-700 hover:bg-slate-600';
            let titleText = `Room ${room.roomNumber}: Vacant`;

            if (room.status === 'occupied') {
              dotBg = 'bg-amber-400 shadow-sm shadow-amber-400/50 hover:bg-amber-300';
              titleText = `Room ${room.roomNumber}: Occupied by ${room.tenant?.name || 'Tenant'}`;
            } else if (room.status === 'secured') {
              dotBg = 'bg-emerald-400 shadow-sm shadow-emerald-400/50 hover:bg-emerald-300';
              titleText = `Room ${room.roomNumber}: Secured by ${room.tenant?.name || 'Tenant'}`;
            } else {
              dotBg = 'bg-rose-500/40 hover:bg-rose-500';
            }

            return (
              <button
                key={room.roomId}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onRoomClick) {
                    onRoomClick(suite, room.roomId);
                  } else {
                    onClick(suite);
                  }
                }}
                title={titleText}
                aria-label={titleText}
                className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center transition-all ${dotBg} text-slate-950`}
              >
                {room.roomNumber}
              </button>
            );
          })}
        </div>

        {totalRent > 0 && (
          <span className="text-[11px] font-semibold text-slate-300">
            {formatCurrency(totalRent)}
          </span>
        )}
      </div>

      {/* Breakdown footer */}
      <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
        <span>
          {occupiedCount}/{totalRooms} Occupied
        </span>
        {vacantCount > 0 && <span className="text-rose-300 font-medium">{vacantCount} Empty</span>}
        {vacantCount === 0 && <span className="text-emerald-300 font-medium">Fully Leased</span>}
      </div>
    </div>
  );
};
