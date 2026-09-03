import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Network, Clock, Activity } from 'lucide-react';

interface StatusBarBottomProps {
  driverStatus?: 'RUNNING' | 'STOPPED' | 'NOT_INSTALLED';
  telemetryStatus?: 'LIVE' | 'CONNECTED_AWAITING_EVENTS' | 'DRIVER_NOT_LOADED' | 'DISCONNECTED';
}

export const StatusBarBottom: React.FC<StatusBarBottomProps> = ({
  driverStatus = 'NOT_INSTALLED',
  telemetryStatus = 'DRIVER_NOT_LOADED'
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

  const getDriverBadge = () => {
    switch (driverStatus) {
      case 'RUNNING':
        return {
          dot: 'bg-emerald-500',
          text: 'RUNNING',
          textColor: 'text-emerald-600 font-bold'
        };
      case 'STOPPED':
        return {
          dot: 'bg-amber-500',
          text: 'STOPPED',
          textColor: 'text-amber-600 font-bold'
        };
      default:
        return {
          dot: 'bg-rose-500',
          text: 'NOT INSTALLED',
          textColor: 'text-rose-600 font-bold'
        };
    }
  };

  const getTelemetryBadge = () => {
    switch (telemetryStatus) {
      case 'LIVE':
        return {
          dot: 'bg-emerald-500 animate-pulse',
          text: 'LIVE',
          textColor: 'text-emerald-600 font-bold'
        };
      case 'CONNECTED_AWAITING_EVENTS':
        return {
          dot: 'bg-sky-500',
          text: 'CONNECTED — AWAITING EVENTS',
          textColor: 'text-sky-600 font-semibold'
        };
      case 'DRIVER_NOT_LOADED':
        return {
          dot: 'bg-amber-500',
          text: 'DRIVER NOT LOADED',
          textColor: 'text-amber-600 font-semibold'
        };
      default:
        return {
          dot: 'bg-rose-500',
          text: 'DISCONNECTED',
          textColor: 'text-rose-600 font-semibold'
        };
    }
  };

  const driverBadge = getDriverBadge();
  const telemetryBadge = getTelemetryBadge();

  return (
    <footer className="w-full bg-card border-t border-slate-200 py-2.5 px-4 lg:px-8 text-xs text-slate-600 shadow-soft sticky bottom-0 z-40">
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
        
        {/* Left: Driver & RansomWatch Security Status */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
          {/* Kernel Driver */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200">
            <span className={`w-2 h-2 rounded-full ${driverBadge.dot}`} />
            <span className="text-slate-500">Kernel Driver:</span>
            <span className="font-semibold text-slate-800">FsFilter.sys</span>
            <span className={`ml-1 ${driverBadge.textColor}`}>{driverBadge.text}</span>
          </div>

          {/* RansomWatch Protection State */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200">
            <span className={`w-2 h-2 rounded-full ${driverStatus === 'RUNNING' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span className="text-slate-500">RansomWatch:</span>
            <span className={`font-semibold ${driverStatus === 'RUNNING' ? 'text-emerald-600' : 'text-amber-600'}`}>
              {driverStatus === 'RUNNING' ? 'ACTIVE' : 'AWAITING DRIVER'}
            </span>
          </div>

          {/* Telemetry Stream */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200">
            <span className={`w-2 h-2 rounded-full ${telemetryBadge.dot}`} />
            <span className="text-slate-500">Telemetry Stream:</span>
            <span className={telemetryBadge.textColor}>
              {telemetryBadge.text}
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
