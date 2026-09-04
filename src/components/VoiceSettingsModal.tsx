import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX, Sparkles, Play, Check, Gauge, Info } from 'lucide-react';
import { VoiceSettings } from '../types';
import { speechService } from '../services/speech-service';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [settings, setSettings] = useState<VoiceSettings>(speechService.getSettings());
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isPlayingSample, setIsPlayingSample] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setSettings(speechService.getSettings());
    const available = speechService.getVoices();
    setVoices(available);

    const unsubscribe = speechService.subscribe((status) => {
      setIsPlayingSample(status === 'speaking');
    });

    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleVoice = () => {
    const updated = speechService.toggleVoice();
    setSettings(prev => ({ ...prev, voiceEnabled: updated }));
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const uri = e.target.value;
    speechService.updateSettings({ selectedVoiceURI: uri });
    setSettings(prev => ({ ...prev, selectedVoiceURI: uri }));
  };

  const handleRateChange = (rate: number) => {
    speechService.updateSettings({ rate });
    setSettings(prev => ({ ...prev, rate }));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    speechService.updateSettings({ volume });
    setSettings(prev => ({ ...prev, volume }));
  };

  const handleTestVoice = () => {
    speechService.testVoice();
  };

  const bestVoice = speechService.getBestFemaleVoice();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="voice-settings-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h2 id="voice-settings-title" className="text-sm font-bold text-slate-900">
                Voice Assistant Settings
              </h2>
              <p className="text-[11px] text-slate-500">Customize BreachGuard speech synthesis</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
            aria-label="Close voice settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global Voice Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>Assistant Voice</span>
              {settings.voiceEnabled ? (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  Enabled
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full">
                  Muted
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Automatically read assistant responses aloud
            </p>
          </div>

          <button
            onClick={handleToggleVoice}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-soft ${
              settings.voiceEnabled
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {settings.voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{settings.voiceEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Voice Selector */}
        <div className="space-y-2">
          <label htmlFor="voice-select" className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span>Selected Voice</span>
            {bestVoice && (
              <span className="text-[10px] font-medium text-purple-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Auto-Female Recommended
              </span>
            )}
          </label>

          <select
            id="voice-select"
            value={settings.selectedVoiceURI}
            onChange={handleVoiceChange}
            disabled={!settings.voiceEnabled || voices.length === 0}
            className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-purple-500 transition-all shadow-soft disabled:bg-slate-50 disabled:text-slate-400"
          >
            <option value="">
              {bestVoice ? `Auto: ${bestVoice.name} (Recommended Female Voice)` : 'System Default Voice'}
            </option>
            {voices.map((v) => {
              const score = speechService.scoreVoice(v);
              const isFemale = score >= 50;
              return (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} {isFemale ? '✨ (Female / Natural)' : ''} ({v.lang})
                </option>
              );
            })}
          </select>

          {voices.length === 0 && (
            <p className="text-[11px] text-amber-600 flex items-center gap-1 mt-1">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>Discovering Windows speech voices... Please try again in a moment.</span>
            </p>
          )}
        </div>

        {/* Speech Speed */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-slate-500" />
            <span>Speech Speed</span>
          </label>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: '0.9x (Calm)', val: 0.9 },
              { label: '1.0x (Normal)', val: 1.0 },
              { label: '1.1x (Brisk)', val: 1.1 }
            ].map((speed) => (
              <button
                key={speed.val}
                type="button"
                onClick={() => handleRateChange(speed.val)}
                disabled={!settings.voiceEnabled}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold text-center transition-all border ${
                  Math.abs(settings.rate - speed.val) < 0.05
                    ? 'bg-purple-50 text-purple-700 border-purple-300 shadow-soft'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                } disabled:opacity-50`}
              >
                {speed.label}
              </button>
            ))}
          </div>
        </div>

        {/* Volume Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span>Volume</span>
            <span className="font-mono text-slate-500">{Math.round(settings.volume * 100)}%</span>
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.volume}
            onChange={handleVolumeChange}
            disabled={!settings.voiceEnabled}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600 disabled:opacity-50"
          />
        </div>

        {/* Footer: Test Voice & Close */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleTestVoice}
            disabled={!settings.voiceEnabled || isPlayingSample}
            className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-soft disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isPlayingSample ? 'animate-pulse text-purple-600' : ''}`} />
            <span>{isPlayingSample ? 'Playing...' : 'Test Voice'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-all shadow-soft flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Done</span>
          </button>
        </div>

      </div>
    </div>
  );
};
