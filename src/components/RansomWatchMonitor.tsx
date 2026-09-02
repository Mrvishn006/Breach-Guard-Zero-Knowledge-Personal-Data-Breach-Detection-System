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
  Play
} from 'lucide-react';
import { RansomWatchProcess, RansomWatchTrap, RansomWatchReport, IrpTelemetryEvent } from '../types';

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

  const getTrapIcon = (category: RansomWatchTrap['category']) => {
    switch (category) {
      case 'DATABASE': return <Database className="w-4 h-4 text-purple-400" />;
      case 'DOCUMENT': return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />;
      case 'ARCHIVE': return <Archive className="w-4 h-4 text-amber-400" />;
      default: return <FileText className="w-4 h-4 text-cyan-400" />;
    }
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
              <h2 className="text-lg font-bold text-white tracking-tight">
                RansomWatch Kernel & Desktop Monitor
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                Driver Port: \RWFilterPort
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Observing Windows File System Minifilter <code className="text-cyan-300">FsFilter.sys</code> + C++/CLI User-Mode Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          <button
            onClick={onTriggerTestAttack}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white shadow-glow-red transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Test Honeypot Detection & Rollback</span>
          </button>
        </div>
      </div>

      {/* Top Grid: Protected Folders & Honeypot Traps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monitored Directories */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderLock className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Protected Directories</h3>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded">
              {directories.length} Active
            </span>
          </div>

          <div className="space-y-2">
            {directories.map((dir, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between">
                <span className="truncate" title={dir}>{dir}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400">
            💡 Directories registered with <code className="text-cyan-300">MESSAGE_ADD_SCAN_DIRECTORY</code> to kernel filter.
          </div>
        </div>

        {/* Honeypot Trap Files Deployed */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-amber-400" />
              <div>
                <h3 className="text-sm font-bold text-white">Honeypot Trap Files (TrapHandler.cpp)</h3>
                <p className="text-[11px] text-slate-400">Autonomously placed to lure and detect encryption attempts</p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded">
              {traps.length} Armed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {traps.map((trap) => (
              <div 
                key={trap.id}
                className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-3 hover:border-slate-700 transition-all"
              >
                <div className="p-2 rounded-lg bg-slate-800/80 shrink-0">
                  {getTrapIcon(trap.category)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{trap.extension} Trap</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      trap.state === 'ARMED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' : 'bg-rose-950 text-rose-400'
                    }`}>
                      {trap.state}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-400 truncate mt-1" title={trap.path}>
                    {trap.path}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Middle Section: Active Process GID Tracker */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Active GID Process Tracking (ProcessesMemory)</h3>
              <p className="text-[11px] text-slate-400">Parent-child lineage grouped by driver via PsSetCreateProcessNotifyRoutine</p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">
            {processes.length} Processes Tracked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3 px-3">GID / Process</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">Shannon Entropy</th>
                <th className="pb-3 px-3">IRP Operations</th>
                <th className="pb-3 px-3">Changed / Created</th>
                <th className="pb-3 px-3">Detected Triggers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {processes.map((proc) => (
                <tr key={proc.gid} className={`hover:bg-slate-800/30 transition-colors ${
                  proc.status === 'TERMINATED' ? 'bg-rose-950/20' : ''
                }`}>
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{proc.name}</div>
                    <div className="text-[11px] text-slate-400">
                      GID: <strong className="text-cyan-300">{proc.gid}</strong> | Main PID: {proc.mainPid} (PIDs: {proc.pids.join(', ')})
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      proc.status === 'TERMINATED'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : proc.status === 'MALICIOUS'
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {proc.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${proc.entropy > 7.0 ? 'text-rose-400' : 'text-slate-200'}`}>
                        {proc.entropy.toFixed(2)} / 8.0
                      </span>
                      <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${proc.entropy > 7.0 ? 'bg-rose-500' : 'bg-emerald-400'}`}
                          style={{ width: `${(proc.entropy / 8.0) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-semibold">
                    {proc.irpCount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    <span className="text-rose-400 font-bold">{proc.changedFilesCount} modified</span> / <span className="text-amber-400">{proc.createdFilesCount} created</span>
                  </td>
                  <td className="py-3 px-3">
                    {proc.detectedTriggers.length > 0 ? (
                      <div className="space-y-1">
                        {proc.detectedTriggers.map((t, idx) => (
                          <span key={idx} className="inline-block text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/60 mr-1">
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Normal Operations</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Section: RansomWatch Incident Report Viewer (C:\Report*.log) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Report List */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Incident Reports Log</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">C:\Report*.log</span>
          </div>

          <div className="space-y-2">
            {reports.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`w-full p-3 rounded-xl text-left border transition-all ${
                  selectedReport.id === report.id
                    ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-glow-cyan'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold font-mono text-cyan-300">
                    C:\Report{report.gid}.log
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-semibold">
                    {report.restoreStatus}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 truncate">
                  Process: {report.processName}
                </div>
                <div className="text-[10px] text-slate-500 mt-1 font-mono">
                  {new Date(report.startTime).toLocaleTimeString()} &bull; {report.changedFiles.length} files affected
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Report Details & Azure Rollback Explorer */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  Report Detail & Azure Blob Rollback: <code className="text-cyan-300">C:\Report{selectedReport.gid}.log</code>
                </h3>
                <p className="text-[11px] text-slate-400">Generated by RansomWatch CheckHandleMaliciousApplication()</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Snapshot Restored</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase block mb-1">Target Executable</span>
              <span className="text-white font-bold">{selectedReport.processName}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase block mb-1">Driver Kill Status</span>
              <span className="text-rose-400 font-bold">Killed via MESSAGE_KILL_GID</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase block mb-1">Azure Backup Snapshot</span>
              <span className="text-emerald-400 font-bold">Valid & Restored</span>
            </div>
          </div>

          {/* Changed Files */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300">
              Encrypted / Changed Files ({selectedReport.changedFiles.length}):
            </h4>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-[11px] text-rose-300 space-y-1 max-h-36 overflow-y-auto">
              {selectedReport.changedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-rose-500">&bull;</span>
                  <span className="truncate">{file}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Created Files (Ransom Notes) */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300">
              Ransom Notes Created ({selectedReport.createdFiles.length}):
            </h4>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-[11px] text-amber-300 space-y-1">
              {selectedReport.createdFiles.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-amber-500">&bull;</span>
                  <span className="truncate">{file}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
