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
      {/* 3D Shield + Stylized 'B' + Green Protection Badge Emblem */}
      <div className={`relative shrink-0 ${emblemSizes[size]}`}>
        <svg 
          viewBox="0 0 512 512" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md transition-transform duration-300 hover:scale-105"
        >
          <defs>
            {/* Metallic Outer Rim */}
            <linearGradient id="shieldRimGrad" x1="64" y1="40" x2="448" y2="480" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#CBD5E1" />
              <stop offset="50%" stopColor="#64748B" />
              <stop offset="75%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            {/* Dark Obsidian / Navy Plate */}
            <linearGradient id="shieldInnerGrad" x1="256" y1="56" x2="256" y2="464" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="35%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#050811" />
            </linearGradient>

            {/* Orange Energy Accent */}
            <linearGradient id="orangeAccentGrad" x1="120" y1="80" x2="392" y2="440" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="30%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>

            {/* Metallic 'B' Gradient */}
            <linearGradient id="bMetalGrad" x1="160" y1="130" x2="360" y2="380" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#F1F5F9" />
              <stop offset="70%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>

            {/* Green Protection Mini Shield Gradient */}
            <linearGradient id="greenBadgeGrad" x1="330" y1="330" x2="450" y2="460" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            {/* Specular Highlight */}
            <linearGradient id="glossGrad" x1="256" y1="56" x2="256" y2="280" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Concentric Glowing Orbital Ring */}
          <circle cx="256" cy="256" r="236" stroke="#FDBA74" strokeWidth="8" strokeDasharray="20 16" opacity="0.65" />
          <circle cx="256" cy="256" r="248" stroke="#F97316" strokeWidth="4" opacity="0.35" />

          {/* Main Beveled 3D Shield Body */}
          <path 
            d="M256 46 L432 108 C432 278 350 398 256 468 C162 398 80 278 80 108 L256 46 Z" 
            fill="url(#shieldRimGrad)" 
          />
          <path 
            d="M256 58 L420 116 C420 270 342 384 256 450 C170 384 92 270 92 116 L256 58 Z" 
            fill="#475569" 
          />
          <path 
            d="M256 68 L408 124 C408 262 334 370 256 434 C178 370 104 262 104 124 L256 68 Z" 
            fill="url(#shieldInnerGrad)" 
          />

          {/* Internal Orange Energy Halo */}
          <path 
            d="M256 82 L394 132 C394 254 326 352 256 414 C186 352 118 254 118 132 L256 82 Z" 
            stroke="url(#orangeAccentGrad)" 
            strokeWidth="5" 
            fill="none" 
            opacity="0.85"
          />

          {/* Stylized Metallic 'B' Emblem */}
          {/* Orange Backlight */}
          <path 
            d="M174 136 H296 C344 136 376 164 376 206 C376 236 356 256 326 264 C364 274 388 300 388 340 C388 388 350 418 298 418 H174 V136 Z" 
            fill="url(#orangeAccentGrad)" 
            opacity="0.45"
          />

          {/* Spine */}
          <rect x="180" y="142" width="46" height="268" rx="23" fill="url(#bMetalGrad)" stroke="#FFFFFF" strokeWidth="2" />

          {/* Top Loop */}
          <path 
            d="M206 142 H296 C336 142 364 166 364 204 C364 240 336 262 296 262 H206 V142 Z" 
            fill="url(#bMetalGrad)" 
            stroke="#FFFFFF" 
            strokeWidth="2"
          />
          <path 
            d="M226 174 H290 C312 174 328 186 328 204 C328 222 312 232 290 232 H226 V174 Z" 
            fill="#0F172A" 
            stroke="url(#orangeAccentGrad)" 
            strokeWidth="3"
          />

          {/* Bottom Loop */}
          <path 
            d="M206 252 H306 C348 252 376 278 376 322 C376 368 348 398 306 398 H206 V252 Z" 
            fill="url(#bMetalGrad)" 
            stroke="#FFFFFF" 
            strokeWidth="2"
          />
          <path 
            d="M226 284 H300 C324 284 340 298 340 322 C340 346 324 364 300 364 H226 V284 Z" 
            fill="#0F172A" 
            stroke="url(#orangeAccentGrad)" 
            strokeWidth="3"
          />

          {/* Security Core Node */}
          <circle cx="266" cy="257" r="10" fill="#FFFFFF" />
          <circle cx="266" cy="257" r="6" fill="#F97316" />

          {/* Top Specular Gloss Highlight */}
          <path 
            d="M256 70 L400 122 C370 220 310 260 256 270 C202 260 142 220 112 122 L256 70 Z" 
            fill="url(#glossGrad)" 
            opacity="0.85"
          />

          {/* Green Protection Shield Badge (Bottom-Right) */}
          <path 
            d="M392 342 L460 366 C460 426 430 464 392 488 C354 464 324 426 324 366 L392 342 Z" 
            fill="url(#greenBadgeGrad)" 
            stroke="#A7F3D0" 
            strokeWidth="4"
          />
          {/* Verified Checkmark in Green Badge */}
          <path 
            d="M366 414 L384 432 L422 390" 
            stroke="#FFFFFF" 
            strokeWidth="8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
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
