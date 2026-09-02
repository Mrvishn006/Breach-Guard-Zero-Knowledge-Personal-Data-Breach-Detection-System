import React from 'react';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Cpu, 
  ArrowRight, 
  Layers, 
  FileText, 
  RotateCcw,
  CheckCircle,
  ExternalLink,
  Zap
} from 'lucide-react';
import { CorrelatedIncident } from '../types';

interface CorrelatedIncidentModalProps {
  incident: CorrelatedIncident | null;
  onClose: () => void;
  onMitigate: (incidentId: string) => void;
}

export const CorrelatedIncidentModal: React.FC<CorrelatedIncidentModalProps> = ({
  incident,
  onClose,
  onMitigate
}) => {
  if (!incident) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl glass-panel-glow rounded-3xl border border-cyan-500/30 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 shadow-glow-red">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
                  {incident.id} &bull; {incident.severity}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date(incident.timestamp).toLocaleString()}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                {incident.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">

          {/* AI Correlation Synthesis Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-purple-950/40 border border-purple-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>AI Threat Correlation Synthesis</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                Cross-Domain Match: 99.4% Confidence
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {incident.correlationSummary}
            </p>
            <div className="pt-2 border-t border-purple-500/20 text-[11px] text-purple-200/90 font-mono">
              <strong>Attack Path:</strong> {incident.attackVector}
            </div>
          </div>

          {/* Side-by-Side Dual-Backend Telemetry Evidence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Left Box: Breach Guard Evidence */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-400 font-bold">
                  <Lock className="w-4 h-4" />
                  <span>Breach Guard Intelligence</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Identity Layer</span>
              </div>

              <div className="space-y-2 text-slate-300 font-mono">
                <div>
                  <span className="text-slate-500 text-[10px] block">Target Account:</span>
                  <span className="text-white font-bold">{incident.linkedEmail || 'admin@enterprise-corp.com'}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Known Compromises:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 text-[10px] border border-rose-800">Dropbox</span>
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 text-[10px] border border-rose-800">LinkedIn</span>
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 text-[10px] border border-rose-800">Adobe</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Compromised Data Types:</span>
                  <span className="text-slate-300">{incident.compromisedDataClasses.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Right Box: RansomWatch Evidence */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Cpu className="w-4 h-4" />
                  <span>RansomWatch Kernel Evidence</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">FsFilter.sys Port</span>
              </div>

              <div className="space-y-2 text-slate-300 font-mono">
                <div>
                  <span className="text-slate-500 text-[10px] block">Executable & GID:</span>
                  <span className="text-white font-bold">{incident.linkedProcess} (GID: {incident.linkedGid})</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Shannon Entropy:</span>
                  <span className="text-rose-400 font-bold">7.94 / 8.00 (High Encryption Spike)</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Kernel Action:</span>
                  <span className="text-emerald-400 font-bold">MESSAGE_KILL_GID Executed &bull; Azure Restored</span>
                </div>
              </div>
            </div>

          </div>

          {/* Recommended Playbook Checklist */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Recommended Autonomous Mitigation Playbook</span>
            </h4>
            
            <div className="space-y-2 font-mono text-slate-300">
              {incident.recommendedPlaybook.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-[11px] leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            Incident State: <strong className="text-white uppercase">{incident.status}</strong>
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onMitigate(incident.id);
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow-green transition-all"
            >
              Mark Mitigated & Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
