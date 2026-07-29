import React from 'react';
import { Floor } from '../types';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface FloorNavigationProps {
  floors: Floor[];
  activeFloor?: number;
}

export const FloorNavigation: React.FC<FloorNavigationProps> = ({ floors }) => {
  const scrollToFloor = (floorNumber: number) => {
    const el = document.getElementById(`floor-${floorNumber}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="hidden lg:flex flex-col items-center fixed right-6 top-28 z-20 bg-slate-950/90 border border-slate-800 backdrop-blur-md p-2 rounded-2xl shadow-2xl">
      <div className="text-[10px] font-bold text-slate-400 mb-1 font-['Space_Grotesk'] tracking-wider uppercase">
        Floors
      </div>

      <button
        onClick={scrollToTop}
        title="Scroll to Top (Floor 21)"
        className="p-1 rounded-lg bg-slate-900 hover:bg-indigo-600 text-slate-400 hover:text-white transition-all mb-1"
      >
        <ChevronUp className="w-4 h-4" />
      </button>

      <div className="flex flex-col gap-1 max-h-[calc(100vh-220px)] overflow-y-auto px-0.5 py-1">
        {floors.map((f) => {
          // Calculate status indicator for quick visual scanning
          let indicatorBg = 'bg-slate-700';
          if (f.vacantRooms === f.totalRooms) {
            indicatorBg = 'bg-rose-500';
          } else if (f.occupiedRooms > 0) {
            indicatorBg = 'bg-amber-400';
          } else if (f.securedRooms > 0) {
            indicatorBg = 'bg-emerald-400';
          }

          return (
            <button
              key={f.floorNumber}
              onClick={() => scrollToFloor(f.floorNumber)}
              title={`Jump to Floor ${f.floorNumber}`}
              className="group flex items-center justify-between gap-2 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700"
            >
              <span className="w-4 text-center">{f.floorNumber}</span>
              <span className={`w-2 h-2 rounded-full ${indicatorBg}`}></span>
            </button>
          );
        })}
      </div>

      <button
        onClick={scrollToBottom}
        title="Scroll to Bottom (Floor 3)"
        className="p-1 rounded-lg bg-slate-900 hover:bg-indigo-600 text-slate-400 hover:text-white transition-all mt-1"
      >
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );
};
