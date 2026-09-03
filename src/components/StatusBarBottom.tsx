import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Network, Clock, Radio, Activity, ShieldCheck } from 'lucide-react';

interface StatusBarBottomProps {
  isDriverActive?: boolean;
  isRansomWatchActive?: boolean;
  isTelemetryLive?: boolean;
}

export const StatusBarBottom: React.FC<StatusBarBottomProps> = ({
  isDriverActive = true,
  isRansomWatchActive = true,
  isTelemetryLive = false
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="w-full bg-card border-t border-slate-200 py-2.5 px-4 lg:px-8 text-xs text-slate-600 shadow-soft sticky bottom-0 z-40">
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
        
        {/* Left: Driver & RansomWatch Security Status */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200">
            <span className={`w-2 h-2 rounded-full ${isDriverActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <span className="text-slate-500">Kernel Driver:</span>
            <span className="font-semibold text-slate-800">FsFilter.sys</span>
            <span className="text-emerald-600 font-bold ml-1">ACTIVE</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200">
            <span className={`w-2 h-2 rounded-full ${isRansomWatchActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            <span className="text-slate-500">RansomWatch:</span>
            <span className="font-semibold text-emerald-600">ACTIVE</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200">
            <span className={`w-2 h-2 rounded-full ${isTelemetryLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            <span className="text-slate-500">Telemetry Stream:</span>
            <span className={isTelemetryLive ? 'text-emerald-600 font-bold' : 'text-slate-500'}>
              {isTelemetryLive ? 'LIVE' : 'STANDBY'}
            </span>
          </div>
        </div>

        {/* Right: Honest System Hardware Telemetry & Real Clock */}
        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
            <span>CPU:</span>
            <span className="text-slate-700 font-medium">--</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-slate-400" />
            <span>Memory:</span>
            <span className="text-slate-700 font-medium">--</span>
          </div>

          <div className="flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-slate-400" />
            <span>Disk:</span>
            <span className="text-slate-700 font-medium">--</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Network className="w-3.5 h-3.5 text-slate-400" />
            <span>Network:</span>
            <span className="text-slate-700 font-medium">--</span>
          </div>

          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 text-slate-700 font-semibold">
            <Clock className="w-3.5 h-3.5 text-brand-500" />
            <span>{currentTime || '--:--:--'}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
