import React, { useState } from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  ShieldAlert, 
  FolderLock, 
  FileCode, 
  Layers, 
  CloudRain, 
  RotateCcw, 
  Terminal, 
  AlertOctagon,
  FileSpreadsheet,
  FileText,
  Database,
  Archive,
  CheckCircle,
  Clock,
  Play,
  Check,
  AlertTriangle,
  RefreshCw,
  FolderSync
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
  const [selectedReport, setSelectedReport] = useState<RansomWatchReport>(reports[0]);
  const [isExecutingAction, setIsExecutingAction] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const getTrapIcon = (category: RansomWatchTrap['category']) => {
    switch (category) {
      case 'DATABASE': return <Database className="w-4 h-4 text-purple-400" />;
      case 'DOCUMENT': return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />;
      case 'ARCHIVE': return <Archive className="w-4 h-4 text-amber-400" />;
      default: return <FileText className="w-4 h-4 text-cyan-400" />;
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
    setActionSuccessMsg(`Azure snapshot rollback completed for GID ${gid}.`);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 shadow-glow-cyan">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">RansomWatch Kernel-Mode Defense Center</h1>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono font-semibold">
                DRIVER LOADED &bull; FsFilter.sys
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live telemetry on communication port <code className="text-cyan-300 font-mono">\\RWFilterPort</code> with real-time Shannon entropy monitoring.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {actionSuccessMsg && (
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800 flex items-center gap-1.5 animate-pulse">
              <Check className="w-3.5 h-3.5" />
              {actionSuccessMsg}
            </span>
          )}
          <button
            onClick={onTriggerTestAttack}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <Play className="w-3.5 h-3.5 text-cyan-400" />
            <span>Simulate Test Attack</span>
          </button>
        </div>
      </div>

      {/* Top Grid: Tracked Process Groups & Honeypot Traps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Process Family & GID Tracking */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white">Tracked Process Groups (GIDs)</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {processes.length} Active Process Families
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 pb-2">
                  <th className="py-2.5 font-semibold">GID / Main PID</th>
                  <th className="py-2.5 font-semibold">Process Name</th>
                  <th className="py-2.5 font-semibold">Entropy</th>
                  <th className="py-2.5 font-semibold">Status</th>
                  <th className="py-2.5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {processes.map((p) => (
                  <tr key={p.gid} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 text-cyan-300">
                      GID: {p.gid} <span className="text-slate-500">({p.mainPid})</span>
                    </td>
                    <td className="py-3 text-slate-200 font-sans font-medium">
                      {p.name}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded ${
                        p.entropy > 7.5 ? 'bg-rose-500/20 text-rose-300 font-bold' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {p.entropy.toFixed(2)} / 8.0
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        p.status === 'TERMINATED' ? 'bg-slate-800 text-slate-400 border border-slate-700' :
                        p.status === 'MALICIOUS' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' :
                        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {p.status !== 'TERMINATED' && (
                        <button
                          onClick={() => handleKillGid(p.gid)}
                          disabled={isExecutingAction}
                          className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 border border-rose-500/40 text-rose-300 text-[11px] font-medium transition-all"
                        >
                          Kill GID
                        </button>
                      )}
                      {p.status === 'TERMINATED' && (
                        <span className="text-slate-500 text-[11px]">Contained</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Column: Honeypot Canary Traps */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderLock className="w-5 h-5 text-purple-400" />
                <h2 className="text-base font-bold text-white">Canary Bait Traps</h2>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 font-mono">
                {traps.filter(t => t.state === 'ARMED').length} Armed
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Trap files planted by <code className="text-purple-300">TrapHandler.cpp</code> to trip ransomware early.
            </p>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {traps.map((trap) => (
                <div key={trap.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    {getTrapIcon(trap.category)}
                    <span className="text-slate-200 truncate font-mono text-[11px]">{trap.path.split('\\').pop()}</span>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono uppercase shrink-0">
                    {trap.state}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
            <span>Instant Trigger &bull; Automatic Process-Group Kill</span>
          </div>
        </div>

      </div>

      {/* Bottom Section: RansomWatch Incident Reports & Cloud Rollback */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">RansomWatch Incident Forensics & Cloud Rollback</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Parsed from <code className="text-cyan-300">C:\Report*.log</code>
          </span>
        </div>

        {reports.length > 0 && selectedReport && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
            
            {/* Incident Summary Card */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{selectedReport.id}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">
                  GID {selectedReport.gid}
                </span>
              </div>

              <div className="space-y-1 text-xs font-mono">
                <div className="text-slate-400">Process: <strong className="text-slate-200 font-sans">{selectedReport.processName}</strong></div>
                <div className="text-slate-400">PIDs: <span className="text-slate-300">{selectedReport.pids.join(', ')}</span></div>
                <div className="text-slate-400">Started: <span className="text-slate-300">{new Date(selectedReport.startTime).toLocaleTimeString()}</span></div>
                <div className="text-slate-400">Driver Kill: <span className="text-rose-400 font-bold">{new Date(selectedReport.killTime).toLocaleTimeString()}</span></div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Cloud Snapshot:</span>
                <span className="text-xs font-semibold text-emerald-400 font-mono">SUCCESS (Azure)</span>
              </div>

              <button
                onClick={() => handleRestoreSnapshot(selectedReport.gid)}
                disabled={isExecutingAction}
                className="w-full py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Verify & Rollback Encrypted Files</span>
              </button>
            </div>

            {/* Affected Files List */}
            <div className="lg:col-span-2 p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">Impacted Files Intercepted ({selectedReport.changedFiles.length})</span>
                <span className="text-slate-500 font-mono">Protected by FsFilter</span>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 font-mono text-[11px]">
                {selectedReport.changedFiles.map((file, fIdx) => (
                  <div key={fIdx} className="p-2 rounded bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                    <span className="text-rose-300 truncate max-w-md">{file}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 shrink-0">
                      RESTORE READY
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
};
