import React from 'react';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Radio, 
  UserCheck, 
  Cpu, 
  FileText, 
  Network, 
  Sparkles, 
  FileSpreadsheet, 
  RotateCcw, 
  Settings 
} from 'lucide-react';

export type NavRailDestination = 
  | 'dashboard'
  | 'threats'
  | 'telemetry'
  | 'identities'
  | 'processes'
  | 'file_activity'
  | 'network'
  | 'ai_analysis'
  | 'reports'
  | 'recovery'
  | 'settings';

interface NavRailRightProps {
  activeDestination: NavRailDestination;
  onSelectDestination: (dest: NavRailDestination) => void;
}

interface NavItem {
  id: NavRailDestination;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'threats', label: 'Threats', icon: ShieldAlert },
  { id: 'telemetry', label: 'Telemetry', icon: Radio },
  { id: 'identities', label: 'Identities', icon: UserCheck },
  { id: 'processes', label: 'Processes', icon: Cpu },
  { id: 'file_activity', label: 'File Activity', icon: FileText },
  { id: 'network', label: 'Network', icon: Network },
  { id: 'ai_analysis', label: 'Assistant', icon: Sparkles },
  { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
  { id: 'recovery', label: 'Recovery', icon: RotateCcw },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export const NavRailRight: React.FC<NavRailRightProps> = ({
  activeDestination,
  onSelectDestination
}) => {
  return (
    <nav 
      aria-label="Secondary Navigation Rail"
      className="hidden xl:flex flex-col items-center py-4 px-2 bg-card rounded-3xl border border-slate-200 shadow-card w-16 shrink-0 space-y-2 sticky top-24 self-start"
    >
      <div className="w-8 h-1 bg-slate-200 rounded-full mb-1" />

      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeDestination === item.id;

        return (
          <div key={item.id} className="relative group flex items-center justify-center">
            <button
              onClick={() => onSelectDestination(item.id)}
              aria-label={item.label}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                isActive
                  ? 'bg-brand-500 text-white shadow-accent-orange scale-105'
                  : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-5 h-5" />
            </button>

            {/* Modern Clean Tooltip */}
            <div className="absolute right-14 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-xl shadow-float whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-150 z-50">
              {item.label}
              <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
            </div>
          </div>
        );
      })}
    </nav>
  );
};
