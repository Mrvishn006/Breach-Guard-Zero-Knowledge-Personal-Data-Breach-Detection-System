import React from 'react';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Cpu, 
  Layers, 
  Zap, 
  CheckCircle2, 
  RotateCcw 
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-card rounded-3xl border border-slate-200 overflow-hidden shadow-float flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 shadow-soft">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                  {incident.id} &bull; {incident.severity}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {new Date(incident.timestamp).toLocaleString()}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-1">
                {incident.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">

          {/* AI Correlation Synthesis Box */}
          <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-purple-600" />
                <span>Evidence-Gated Threat Correlation</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-semibold">
                Verified Grounded Signals
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {incident.correlationSummary}
            </p>
            <div className="pt-2 border-t border-purple-200/60 text-[11px] text-purple-900 font-mono">
              <strong>Attack Path:</strong> {incident.attackVector || 'Verified telemetry sequence'}
            </div>
          </div>

          {/* Side-by-Side Dual-Backend Telemetry Evidence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Left Box: Breach Guard Evidence */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-indigo-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-indigo-700 font-bold">
                  <Lock className="w-4 h-4" />
                  <span>Breach Guard Intelligence</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Identity Layer</span>
              </div>

              <div className="space-y-2 text-slate-700 font-mono">
                <div>
                  <span className="text-slate-400 text-[10px] block">Target Account:</span>
                  <span className="text-slate-900 font-bold">{incident.linkedEmail || 'No linked identity'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Known Compromises:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {incident.rawBreachGuardData?.breaches?.length ? (
                      incident.rawBreachGuardData.breaches.map((b, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] border border-rose-200 font-semibold">{b}</span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-[10px]">None flagged in active session</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Compromised Data Types:</span>
                  <span className="text-slate-800">
                    {incident.compromisedDataClasses.length ? incident.compromisedDataClasses.join(', ') : 'None'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Box: RansomWatch Evidence */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-brand-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-brand-700 font-bold">
                  <Cpu className="w-4 h-4" />
                  <span>RansomWatch Kernel Evidence</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">FsFilter.sys Port</span>
              </div>

              <div className="space-y-2 text-slate-700 font-mono">
                <div>
                  <span className="text-slate-400 text-[10px] block">Executable & GID:</span>
                  <span className="text-slate-900 font-bold">{incident.linkedProcess || 'System process'} (GID: {incident.linkedGid || 'N/A'})</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Observed Evidence:</span>
                  <div className="space-y-1 mt-1">
                    {(incident.evidence || []).map((ev, i) => (
                      <div key={i} className="text-[10px] text-slate-700 bg-white p-1.5 rounded-lg border border-slate-200">
                        <strong className="text-brand-600">[{ev.source}]</strong> {ev.details}
                      </div>
                    ))}
                    {!incident.evidence?.length && (
                      <span className="text-slate-400 text-[10px]">Real-time kernel monitoring active</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Recommended Playbook Checklist */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Recommended Autonomous Mitigation Playbook</span>
            </h4>
            
            <div className="space-y-2 font-mono text-slate-700">
              {incident.recommendedPlaybook.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-slate-200 shadow-soft">
                  <span className="w-5 h-5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center font-bold text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-[11px] leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Incident State: <strong className="text-slate-900 uppercase font-semibold">{incident.status}</strong>
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors shadow-soft"
            >
              Close
            </button>
            <button
              onClick={() => {
                onMitigate(incident.id);
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-soft transition-all"
            >
              Mark Mitigated & Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
