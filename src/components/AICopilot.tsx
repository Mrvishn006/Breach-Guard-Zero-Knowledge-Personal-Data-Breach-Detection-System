import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Lock, 
  ArrowRight,
  RefreshCw,
  Zap,
  Check
} from 'lucide-react';
import { AIChatMessage, CorrelatedIncident } from '../types';
import { aiAgentOrchestrator } from '../services/ai-agent-orchestrator';

interface AICopilotProps {
  messages: AIChatMessage[];
  onSendMessage: (query: string) => Promise<void>;
  onSelectIncident: (incident: CorrelatedIncident) => void;
  onSimulateAttack: () => void;
}

export const AICopilot: React.FC<AICopilotProps> = ({
  messages,
  onSendMessage,
  onSelectIncident,
  onSimulateAttack
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [executedAction, setExecutedAction] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isProcessing) return;

    const q = inputQuery;
    setInputQuery('');
    setIsProcessing(true);
    try {
      await onSendMessage(q);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickAction = async (prompt: string, actionKey?: string) => {
    if (actionKey === 'TEST_ATTACK') {
      onSimulateAttack();
      return;
    }
    if (actionKey === 'RESET_PASSWORD' || actionKey === 'VERIFY_AZURE' || actionKey === 'AUTO_MITIGATE') {
      setExecutedAction(actionKey);
      setTimeout(() => setExecutedAction(null), 3500);
    }
    setIsProcessing(true);
    try {
      await onSendMessage(prompt);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col h-[750px] space-y-4">
      
      {/* Copilot Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 shadow-glow-purple">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                AegisGuard AI Security Copilot & Orchestrator
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                Agentic Layer
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous correlation engine fusing kernel minifilter events + dark web breach intelligence
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>RW-Driver</span>
          <span className="text-slate-600">+</span>
          <Lock className="w-3.5 h-3.5 text-indigo-400" />
          <span>BG-kAnon</span>
        </div>
      </div>

      {/* Action Execution Notification */}
      {executedAction && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-mono flex items-center justify-between animate-fadeIn shrink-0">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>
              {executedAction === 'RESET_PASSWORD' && 'Autonomous action executed: Forced Active Directory password reset and session invalidation!'}
              {executedAction === 'VERIFY_AZURE' && 'Autonomous action executed: Validated Azure Blob immutable backup container snapshot hashes!'}
              {executedAction === 'AUTO_MITIGATE' && 'Autonomous playbook executed: Driver kill verified + AD credentials rotated + Traps re-armed!'}
            </span>
          </div>
          <span className="text-[10px] text-emerald-400">SUCCESS</span>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 text-xs leading-relaxed ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'agent' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-glow-purple mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl p-4 rounded-2xl border transition-all ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white border-indigo-500 rounded-br-none shadow-glow-purple font-medium'
                  : 'bg-slate-900/90 text-slate-200 border-slate-800 rounded-bl-none shadow-glass'
              }`}
            >
              {/* Message text with formatted markdown lines */}
              <div className="space-y-2 whitespace-pre-wrap">
                {msg.text.split('\n\n').map((paragraph, pIdx) => {
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={pIdx} className="text-sm font-bold text-cyan-300 mt-2 mb-1 flex items-center gap-1.5">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  return (
                    <p key={pIdx} className="text-xs leading-relaxed text-slate-200">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Linked Incident Context Button */}
              {msg.incidentContext && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-rose-400 font-bold">
                    Target: {msg.incidentContext.id} ({msg.incidentContext.linkedProcess})
                  </span>
                  <button
                    onClick={() => onSelectIncident(msg.incidentContext!)}
                    className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <span>Inspect Evidence</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Suggested Action Chips */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-800/80">
                  {msg.suggestedActions.map((action, aIdx) => (
                    <button
                      key={aIdx}
                      onClick={() => handleQuickAction(action.label, action.actionKey)}
                      className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-purple-950/80 hover:bg-purple-900/90 text-purple-200 border border-purple-700/60 transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                <span className="text-xs font-bold font-mono">SOC</span>
              </div>
            )}
          </div>
        ))}

        {isProcessing && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-purple-300 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
              <span>Correlating kernel IRP logs with identity breach database...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Queries Prompt Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px] shrink-0">
        <button
          onClick={() => handleQuickAction('Explain incident REP-1042 and how the ransomware was killed')}
          className="px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 shrink-0 whitespace-nowrap"
        >
          🔍 Explain Incident REP-1042
        </button>
        <button
          onClick={() => handleQuickAction('Calculate enterprise composite risk breakdown')}
          className="px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 shrink-0 whitespace-nowrap"
        >
          📊 Risk Score Breakdown
        </button>
        <button
          onClick={() => handleQuickAction('What is the recommended incident response playbook?')}
          className="px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 shrink-0 whitespace-nowrap"
        >
          🛡️ Mitigation Playbook
        </button>
        <button
          onClick={() => handleQuickAction('How does RansomWatch TrapHandler work with Shannon Entropy?')}
          className="px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 shrink-0 whitespace-nowrap"
        >
          ⚡ Kernel Minifilter Mechanics
        </button>
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 shrink-0 pt-2 border-t border-slate-800">
        <input
          type="text"
          placeholder="Ask AI Copilot to correlate events, analyze threats, or trigger playbooks..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          className="flex-1 bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors font-mono"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isProcessing}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-glow-purple transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Inquire</span>
        </button>
      </form>

    </div>
  );
};
