import React, { useState } from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  ShieldAlert, 
  FolderLock, 
  FileCode, 
  Layers, 
  RotateCcw, 
  Terminal, 
  FileSpreadsheet, 
  FileText, 
  Database, 
  Archive, 
  Check, 
  Clock, 
  Play, 
  AlertTriangle 
} from 'lucide-react';
import { RansomWatchProcess, RansomWatchTrap, RansomWatchReport, IrpTelemetryEvent } from '../types';
import { ransomWatchAdapter } from '../adapters/ransomwatch-adapter';

interface RansomWatchMonitorProps {
  processes: RansomWatchProcess[];
  traps: RansomWatchTrap[];
  reports: RansomWatchReport[];
  directories: string[];
  recentIrps: IrpTelemetryEvent[];
  onTriggerTestAttack: () => void;
}

export const RansomWatchMonitor: React.FC<RansomWatchMonitorProps> = ({
  processes,
  traps,
  reports,
  directories,
  recentIrps,
  onTriggerTestAttack
}) => {
  const [selectedReport, setSelectedReport] = useState<RansomWatchReport | null>(reports[0] || null);
  const [isExecutingAction, setIsExecutingAction] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const getTrapIcon = (category: RansomWatchTrap['category']) => {
    switch (category) {
      case 'DATABASE': return <Database className="w-4 h-4 text-purple-600" />;
      case 'DOCUMENT': return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
      case 'ARCHIVE': return <Archive className="w-4 h-4 text-amber-600" />;
      default: return <FileText className="w-4 h-4 text-brand-600" />;
    }
  };

  const handleKillGid = async (gid: number) => {
    setIsExecutingAction(true);
    await ransomWatchAdapter.dispatchControlledAction('TERMINATE_GID', gid);
    setIsExecutingAction(false);
    setActionSuccessMsg(`Driver signal dispatched: GID ${gid} terminated.`);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const handleRestoreSnapshot = async (gid: number) => {
    setIsExecutingAction(true);
    await ransomWatchAdapter.dispatchControlledAction('RESTORE_SNAPSHOT', gid);
    setIsExecutingAction(false);
    setActionSuccessMsg(`Rollback command completed for GID ${gid}.`);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Info Banner */}
      <div className="bg-card p-6 rounded-3xl border border-slate-200 shadow-card flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 shadow-soft">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">RansomWatch Kernel Defense Center</h1>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold">
                DRIVER LOADED &bull; FsFilter.sys
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live telemetry on communication port <code className="text-brand-600 font-mono font-semibold">\\RWFilterPort</code> with real-time Shannon entropy monitoring.
            </p>
          </div>
        </div>

        {/* Action / Success Feedback */}
        <div className="flex items-center gap-2">
          {actionSuccessMsg && (
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 animate-pulse">
              <Check className="w-3.5 h-3.5" />
              {actionSuccessMsg}
            </span>
          )}
        </div>
      </div>

      {/* 2. Top Grid: Tracked Process Groups & Canary Traps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Process Family & GID Tracking */}
        <div className="lg:col-span-2 bg-card p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-500" />
              <h2 className="text-sm font-bold text-slate-900">Tracked Process Groups (GIDs)</h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {processes.length} Tracked Families
            </span>
          </div>

          <div className="overflow-x-auto">
            {processes.length === 0 ? (
              <div className="py-12 text-center text-slate-500 font-sans space-y-1.5 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <ShieldCheck className="w-7 h-7 text-emerald-500 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">No active or suspicious process groups detected.</p>
                <p className="text-[11px] text-slate-400">System is idle and protected by kernel minifilter.</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 pb-2">
                    <th className="py-2.5 font-semibold">GID / Main PID</th>
                    <th className="py-2.5 font-semibold">Process Name</th>
                    <th className="py-2.5 font-semibold">Entropy</th>
                    <th className="py-2.5 font-semibold">Status</th>
                    <th className="py-2.5 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {processes.map((p) => (
                    <tr key={p.gid} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 text-brand-600 font-semibold">
                        GID: {p.gid} <span className="text-slate-400 font-normal">({p.mainPid})</span>
                      </td>
                      <td className="py-3 text-slate-900 font-sans font-medium">
                        {p.name}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-md ${
                          p.entropy > 7.5 ? 'bg-rose-100 text-rose-800 font-bold' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {p.entropy.toFixed(2)} / 8.0
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          p.status === 'TERMINATED' ? 'bg-slate-100 text-slate-600 border border-slate-200' :
                          p.status === 'MALICIOUS' ? 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {p.status !== 'TERMINATED' && (
                          <button
                            onClick={() => handleKillGid(p.gid)}
                            disabled={isExecutingAction}
                            className="px-3 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-semibold transition-all shadow-soft"
                          >
                            Kill GID
                          </button>
                        )}
                        {p.status === 'TERMINATED' && (
                          <span className="text-slate-400 text-[11px]">Contained</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right 1 Column: Honeypot Canary Traps */}
        <div className="bg-card p-6 rounded-3xl border border-slate-200 shadow-card space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderLock className="w-4 h-4 text-purple-600" />
                <h2 className="text-sm font-bold text-slate-900">Canary Bait Traps</h2>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-mono font-semibold">
                {traps.filter(t => t.state === 'ARMED').length} Armed
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Trap files monitored by <code className="text-purple-700 font-mono">TrapHandler.cpp</code> to intercept ransomware early.
            </p>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {traps.map((trap) => (
                <div key={trap.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    {getTrapIcon(trap.category)}
                    <span className="text-slate-800 truncate font-mono text-[11px] font-medium">{trap.path.split('\\').pop()}</span>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono uppercase font-bold shrink-0 ${
                    trap.state === 'TRIGGERED' ? 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {trap.state}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
            <span>Instant Trigger &bull; Automatic Process-Group Kill</span>
          </div>
        </div>

      </div>

      {/* 3. Bottom Section: Incident Forensics & Rollback Reports */}
      <div className="bg-card p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-brand-500" />
            <h2 className="text-sm font-bold text-slate-900">RansomWatch Incident Forensics & Rollback</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Authoritative source: <code className="text-brand-600 font-semibold">C:\Report*.log</code>
          </span>
        </div>

        {reports.length === 0 ? (
          <div className="py-10 text-center text-slate-500 font-sans border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-1.5">
            <ShieldCheck className="w-7 h-7 text-emerald-500 mx-auto" />
            <p className="text-xs font-semibold text-slate-700">No incident logs present on system drive.</p>
            <p className="text-[11px] text-slate-400">When FsFilter.sys intercepts ransomware, forensic Report*.log artifacts appear here.</p>
          </div>
        ) : (
          selectedReport && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
              
              {/* Incident Summary Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{selectedReport.id}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-mono font-bold">
                    GID {selectedReport.gid}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  <div className="text-slate-500">Process: <strong className="text-slate-900 font-sans">{selectedReport.processName}</strong></div>
                  <div className="text-slate-500">PIDs: <span className="text-slate-800">{selectedReport.pids.join(', ')}</span></div>
                  <div className="text-slate-500">Started: <span className="text-slate-800">{new Date(selectedReport.startTime).toLocaleTimeString()}</span></div>
                  <div className="text-slate-500">Driver Kill: <span className="text-rose-700 font-bold">{new Date(selectedReport.killTime).toLocaleTimeString()}</span></div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Status:</span>
                  <span className="text-xs font-bold text-emerald-700 font-mono">CONTAINED</span>
                </div>

                <button
                  onClick={() => handleRestoreSnapshot(selectedReport.gid)}
                  disabled={isExecutingAction}
                  className="w-full py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-soft"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Verify Impacted Files</span>
                </button>
              </div>

              {/* Affected Files List */}
              <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900">Impacted Files Intercepted ({selectedReport.changedFiles.length})</span>
                  <span className="text-slate-400 font-mono">Protected by FsFilter</span>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 font-mono text-[11px]">
                  {selectedReport.changedFiles.map((file, fIdx) => (
                    <div key={fIdx} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-soft">
                      <span className="text-rose-700 truncate max-w-md font-medium">{file}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold shrink-0">
                        INTERCEPTED
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )
        )}
      </div>

    </div>
  );
};
