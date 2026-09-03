import React from 'react';

interface BreachGuardLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  subtitle?: 'SOC' | 'SECURITY OPERATIONS CENTER' | 'none';
  className?: string;
  isOnline?: boolean;
}

export const BreachGuardLogo: React.FC<BreachGuardLogoProps> = ({
  size = 'md',
  showWordmark = true,
  subtitle = 'SECURITY OPERATIONS CENTER',
  className = '',
  isOnline = true
}) => {
  // Determine pixel sizes for the emblem
  const emblemSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  const subSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-xs'
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Shield + Stylized 'B' Security Emblem */}
      <div className={`relative shrink-0 ${emblemSizes[size]}`}>
        <svg 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm transition-transform duration-300 hover:scale-105"
        >
          <defs>
            <linearGradient id="bgGradMain" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>

            <linearGradient id="bgGradInner" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#FFF7ED" />
            </linearGradient>

            <filter id="bgShadowSm" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#EA580C" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Concentric Guard / Protection Ring */}
          <circle cx="24" cy="24" r="22" stroke="#FDBA74" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.65" />
          <circle cx="24" cy="24" r="23.5" stroke="#FB923C" strokeWidth="0.75" opacity="0.3" />

          {/* Shield Base */}
          <path 
            d="M24 4.5L38 10.5C38 23.5 31.5 35 24 43.5C16.5 35 10 23.5 10 10.5L24 4.5Z" 
            fill="url(#bgGradMain)" 
            filter="url(#bgShadowSm)"
          />

          {/* Rim Highlight */}
          <path 
            d="M24 6.2L36.2 11.5C36.2 22.8 30.5 33.2 24 41C17.5 33.2 11.8 22.8 11.8 11.5L24 6.2Z" 
            stroke="#FFEDD5" 
            strokeWidth="0.8" 
            opacity="0.45"
            fill="none"
          />

          {/* Stylized 'B' Structure */}
          {/* Vertical Spine */}
          <rect x="17" y="14" width="3.5" height="20" rx="1.75" fill="url(#bgGradInner)" />
          
          {/* Upper Bow */}
          <path 
            d="M19 14H26.5C29.5 14 31.5 15.8 31.5 18.5C31.5 21.2 29.5 23 26.5 23H19V14Z" 
            fill="url(#bgGradInner)"
          />
          <path 
            d="M20.5 16.5H26C27.8 16.5 29 17.3 29 18.5C29 19.7 27.8 20.5 26 20.5H20.5V16.5Z" 
            fill="#EA580C"
          />

          {/* Lower Bow */}
          <path 
            d="M19 22H27.5C30.8 22 33 24 33 27C33 30 30.8 32 27.5 32H19V22Z" 
            fill="url(#bgGradInner)"
          />
          <path 
            d="M20.5 24.5H26.8C28.8 24.5 30.2 25.5 30.2 27C30.2 28.5 28.8 29.5 26.8 29.5H20.5V24.5Z" 
            fill="#EA580C"
          />

          {/* Micro Lock / Guard Core */}
          <circle cx="24" cy="23.5" r="1.2" fill="#FFFFFF" />
        </svg>

        {/* Live Protection Status Indicator */}
        {isOnline && (
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white shadow-soft" />
        )}
      </div>

      {/* Wordmark & Product Label */}
      {showWordmark && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold tracking-tight text-slate-900 leading-none ${textSizes[size]}`}>
              BreachGuard
            </span>
            {subtitle === 'SOC' && (
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200 leading-none">
                SOC
              </span>
            )}
          </div>
          {subtitle === 'SECURITY OPERATIONS CENTER' && (
            <span className={`font-bold tracking-wider text-brand-600 uppercase mt-0.5 ${subSizes[size]}`}>
              SECURITY OPERATIONS CENTER
            </span>
          )}
        </div>
      )}
    </div>
  );
};
