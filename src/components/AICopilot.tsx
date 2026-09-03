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
  HelpCircle,
  User
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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[720px]">
      
      {/* Left 3 Columns: Interactive AI Chat Stream */}
      <div className="lg:col-span-3 bg-card rounded-3xl flex flex-col justify-between overflow-hidden border border-slate-200 shadow-card">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 shadow-soft">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">BreachGuard AI SOC Copilot</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-semibold">
                  Telemetry Grounded
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Deterministic Threat Triage & Cross-Domain RCA</p>
            </div>
          </div>

          {actionFeedback && (
            <div className="text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-pulse flex items-center gap-1.5">
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
              <div className="flex items-center gap-1.5 mb-1 px-1">
                {msg.sender === 'user' ? (
                  <User className="w-3 h-3 text-brand-600" />
                ) : (
                  <Bot className="w-3 h-3 text-purple-600" />
                )}
                <span className="text-[11px] font-semibold text-slate-500">
                  {msg.sender === 'user' ? 'SOC Analyst' : 'AI Security Copilot'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-2xl p-4 rounded-3xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-brand-500 text-white rounded-tr-sm shadow-soft'
                    : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-sm shadow-soft whitespace-pre-line'
                }`}
              >
                {msg.text}

                {/* Suggested Action Buttons */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200/80 flex flex-wrap gap-2">
                    {msg.suggestedActions.map((action, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => handleExecuteAction(action.actionKey, action.label)}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-soft"
                      >
                        <Zap className="w-3 h-3 text-purple-600" />
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-2 text-slate-500 text-xs font-mono p-2">
              <div className="w-3.5 h-3.5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              <span>Analyzing kernel IRP telemetry & identity graphs...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask Copilot (e.g. 'What is happening on my system?', 'Why is this incident critical?')..."
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 transition-all font-sans pr-24 shadow-soft"
            />
            <button
              type="submit"
              disabled={isProcessing || !inputQuery.trim()}
              className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-soft"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>

      </div>

      {/* Right 1 Column: Recommended SOC Queries & Playbooks */}
      <div className="bg-card p-6 rounded-3xl flex flex-col justify-between space-y-4 border border-slate-200 shadow-card">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-sm">Quick Triage Questions</h3>
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
                className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-purple-50/60 border border-slate-200 hover:border-purple-200 text-slate-700 hover:text-purple-900 text-xs transition-all flex items-center justify-between group shadow-soft"
              >
                <span className="truncate pr-2 font-medium">{q}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 font-mono space-y-1">
          <div>🛡️ Grounded in real driver events</div>
          <div>🚫 Zero simulated or fake alerts</div>
        </div>
      </div>

    </div>
  );
};
