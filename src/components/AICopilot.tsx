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
  Check,
  HelpCircle
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
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
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

  const handleQuickQuestion = async (question: string) => {
    setIsProcessing(true);
    try {
      await onSendMessage(question);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecuteAction = async (actionKey: string, label: string) => {
    const res = await aiAgentOrchestrator.executeSuggestedAction(actionKey);
    setActionFeedback(res);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[740px]">
      
      {/* Left 3 Columns: Interactive AI Chat Stream */}
      <div className="lg:col-span-3 glass-panel rounded-2xl flex flex-col justify-between overflow-hidden border border-slate-800">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">BreachGuard AI SOC Copilot</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono">
                  Telemetry Grounded
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Deterministic Threat Triage & Cross-Domain RCA</p>
            </div>
          </div>

          {actionFeedback && (
            <div className="text-xs font-mono text-emerald-300 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800 animate-pulse flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>{actionFeedback}</span>
            </div>
          )}
        </div>

        {/* Message Log */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="text-[11px] font-semibold text-slate-400">
                  {msg.sender === 'user' ? 'SOC Analyst' : 'AI Security Copilot'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-sm shadow-md'
                    : 'glass-panel bg-slate-900/80 text-slate-200 border border-slate-800 rounded-tl-sm whitespace-pre-line'
                }`}
              >
                {msg.text}

                {/* Suggested Action Buttons */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap gap-2">
                    {msg.suggestedActions.map((action, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => handleExecuteAction(action.actionKey, action.label)}
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-medium flex items-center gap-1 transition-all"
                      >
                        <Zap className="w-3 h-3 text-indigo-400" />
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono p-2">
              <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              <span>Analyzing kernel IRP telemetry & identity graphs...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/40">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask Copilot (e.g. 'What is happening on my system?', 'Why is this incident critical?')..."
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono pr-24"
            />
            <button
              type="submit"
              disabled={isProcessing || !inputQuery.trim()}
              className="absolute right-2 top-2 bottom-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>

      </div>

      {/* Right 1 Column: Recommended SOC Queries & Playbooks */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between space-y-4 border border-slate-800">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">Quick Triage Questions</h3>
          </div>

          <div className="space-y-2">
            {[
              'What is happening on my system?',
              'Why is this incident critical?',
              'Which process caused the activity?',
              'What evidence triggered the alert?',
              'What should I do next?'
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickQuestion(q)}
                disabled={isProcessing}
                className="w-full text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white text-xs transition-all flex items-center justify-between group"
              >
                <span className="truncate pr-2">{q}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono space-y-1">
          <div>🛡️ Grounded strictly in real driver events</div>
          <div>🚫 Zero hallucinations or fake alerts</div>
        </div>
      </div>

    </div>
  );
};
