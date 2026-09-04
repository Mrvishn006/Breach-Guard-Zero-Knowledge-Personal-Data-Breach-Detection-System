import React from 'react';
import { Sparkles } from 'lucide-react';
import { BreachGuardLogo } from './BreachGuardLogo';

interface AssistantAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  isSpeaking?: boolean;
  className?: string;
}

export const AssistantAvatar: React.FC<AssistantAvatarProps> = ({
  size = 'md',
  isSpeaking = false,
  className = ''
}) => {
  const containerSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };

  const logoSizes = {
    sm: 'sm' as const,
    md: 'sm' as const,
    lg: 'md' as const
  };

  return (
    <div className={`relative shrink-0 ${containerSizes[size]} ${className}`}>
      {/* Speaking Ambient Glow / Pulse Aura */}
      {isSpeaking && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-500/30 to-brand-500/30 blur-md animate-pulse pointer-events-none" />
      )}

      {/* Main Avatar Container */}
      <div 
        className={`relative w-full h-full rounded-2xl bg-gradient-to-b from-white to-slate-50 border flex items-center justify-center shadow-soft transition-all duration-300 ${
          isSpeaking 
            ? 'border-purple-300 ring-2 ring-purple-200/60 shadow-purple-100 scale-105' 
            : 'border-slate-200 hover:border-purple-200'
        }`}
      >
        <BreachGuardLogo 
          size={logoSizes[size]} 
          showWordmark={false} 
          subtitle="none"
        />

        {/* AI Sparkle Badge */}
        <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-sm ring-2 ring-white">
          <Sparkles className="w-2.5 h-2.5" />
        </div>
      </div>
    </div>
  );
};
