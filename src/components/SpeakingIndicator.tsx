import React from 'react';
import { Volume2, Pause, AlertCircle } from 'lucide-react';
import { SpeechStatus } from '../types';

interface SpeakingIndicatorProps {
  status: SpeechStatus;
  showWhenIdle?: boolean;
  className?: string;
}

export const SpeakingIndicator: React.FC<SpeakingIndicatorProps> = ({
  status,
  showWhenIdle = false,
  className = ''
}) => {
  if (status === 'idle' && !showWhenIdle) {
    return null;
  }

  if (status === 'speaking') {
    return (
      <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-medium shadow-soft animate-in fade-in duration-200 ${className}`}>
        {/* Animated Audio Waveform Equalizer */}
        <div className="flex items-center gap-0.5 h-3.5 px-0.5">
          <span className="w-0.5 bg-purple-600 rounded-full animate-[waveform_0.8s_ease-in-out_infinite] h-2" />
          <span className="w-0.5 bg-purple-600 rounded-full animate-[waveform_0.8s_ease-in-out_0.2s_infinite] h-3.5" />
          <span className="w-0.5 bg-purple-600 rounded-full animate-[waveform_0.8s_ease-in-out_0.4s_infinite] h-1.5" />
          <span className="w-0.5 bg-purple-600 rounded-full animate-[waveform_0.8s_ease-in-out_0.1s_infinite] h-3" />
        </div>
        <span className="text-[11px] font-semibold tracking-wide">Speaking...</span>
      </div>
    );
  }

  if (status === 'paused') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-medium shadow-soft ${className}`}>
        <Pause className="w-3 h-3 text-amber-600" />
        <span>Paused</span>
      </div>
    );
  }

  if (status === 'unavailable') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-[11px] ${className}`} title="System speech synthesis is not active on this environment">
        <Volume2 className="w-3 h-3 text-slate-400" />
        <span>Voice unavailable</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-medium ${className}`}>
        <AlertCircle className="w-3 h-3 text-rose-500" />
        <span>Voice error</span>
      </div>
    );
  }

  if (showWhenIdle && status === 'idle') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-mono ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span>Ready</span>
      </div>
    );
  }

  return null;
};
