import React from 'react';
import { Room, TenantRecord } from '../types';
import { X, MapPin, Hash, Layers, FileText, Mail, Phone } from 'lucide-react';

interface TenantDetailModalProps {
  tenant: TenantRecord | null;
  room?: Room | null;
  onClose: () => void;
}

export const TenantDetailModal: React.FC<TenantDetailModalProps> = ({ tenant, onClose }) => {
  if (!tenant) return null;

  // Build key-value list dynamically based on workbook columns (extraFields)
  // Fallback to tenant object entries if extraFields not populated
  let dynamicEntries: [string, any][] = [];

  if (tenant.extraFields && Object.keys(tenant.extraFields).length > 0) {
    dynamicEntries = Object.entries(tenant.extraFields);
  } else {
    // Fallback standard fields
    dynamicEntries = [
      ['Unit', tenant.unit],
      ['Tenant ID', tenant.tenantId],
      ['Name', tenant.name],
      ['Email', tenant.email],
      ['Phone', tenant.phone],
      ['Birth Year', tenant.birthYear],
      ['Rent', tenant.rent ? `$${tenant.rent}` : ''],
      ['Lease Start Date', tenant.leaseStartDate],
      ['Lease End Date', tenant.leaseEndDate],
      ['Status', tenant.status || 'Occupied'],
    ].filter(([, val]) => val !== undefined && val !== null && val !== '') as [string, any][];
  }

  // Display Name header
  const displayName = tenant.name || tenant.extraFields?.Name || tenant.extraFields?.name || `Tenant (${tenant.unit})`;
  const displayStatus = tenant.status || tenant.extraFields?.Status || tenant.extraFields?.status || 'Occupied';
  const displayUnit = tenant.unit || tenant.extraFields?.Unit || tenant.extraFields?.unit || '';
  const displayTenantId = tenant.tenantId || tenant.extraFields?.['Tenant ID'] || tenant.extraFields?.tenantId || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div
        className="glass-panel w-full max-w-xl rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-900/50 via-slate-900 to-slate-900 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-extrabold text-2xl shadow-lg">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                  {displayName}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {displayStatus}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                {displayUnit && (
                  <span className="flex items-center gap-1 text-indigo-300 font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    Unit {displayUnit}
                  </span>
                )}
                {displayUnit && displayTenantId && <span>•</span>}
                {displayTenantId && (
                  <span className="flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-slate-400" />
                    {displayTenantId}
                  </span>
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

        {/* Modal Body: 100% Dynamic Workbook Attributes Grid */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Workbook Attributes ({dynamicEntries.length} Columns Mapped)
            </h3>
            <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20 font-semibold">
              Dynamic Column Mapping
            </span>
          </div>

          {/* Dynamic Grid of All Workbook Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {dynamicEntries.map(([colName, rawVal]) => {
              const valStr = typeof rawVal === 'object' ? JSON.stringify(rawVal) : String(rawVal);
              const isEmail = colName.toLowerCase().includes('email') || valStr.includes('@');
              const isPhone = colName.toLowerCase().includes('phone') || colName.toLowerCase().includes('mobile');
              const isRent = colName.toLowerCase().includes('rent') || colName.toLowerCase().includes('amount') || colName.toLowerCase().includes('price');

              return (
                <div
                  key={colName}
                  className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm"
                >
                  <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                    <FileText className="w-3 h-3 text-indigo-400" />
                    <span>{colName}</span>
                  </div>

                  <div className="mt-1.5 font-semibold text-white break-words">
                    {isEmail ? (
                      <a
                        href={`mailto:${valStr}`}
                        className="text-indigo-300 hover:underline flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" />
                        {valStr}
                      </a>
                    ) : isPhone ? (
                      <a
                        href={`tel:${valStr}`}
                        className="text-indigo-300 hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        {valStr}
                      </a>
                    ) : isRent && !valStr.startsWith('$') ? (
                      <span className="text-emerald-400 font-bold font-['Space_Grotesk'] text-sm">
                        ${parseFloat(valStr).toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-slate-100">{valStr}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
