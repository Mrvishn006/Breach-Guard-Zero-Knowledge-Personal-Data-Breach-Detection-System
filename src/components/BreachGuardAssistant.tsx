import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Settings, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  ShieldAlert, 
  HelpCircle, 
  ArrowRight, 
  Zap, 
  Check, 
  User, 
  Radio
} from 'lucide-react';
import { AIChatMessage, CorrelatedIncident, SpeechStatus, TechnicalDetailsItem } from '../types';
import { aiAgentOrchestrator } from '../services/ai-agent-orchestrator';
import { speechService } from '../services/speech-service';
import { AssistantAvatar } from './AssistantAvatar';
import { SpeakingIndicator } from './SpeakingIndicator';
import { VoiceSettingsModal } from './VoiceSettingsModal';

interface BreachGuardAssistantProps {
  messages: AIChatMessage[];
  onSendMessage: (query: string) => Promise<void>;
  onSelectIncident: (incident: CorrelatedIncident) => void;
  onSimulateAttack?: () => void;
  isTelemetryLive?: boolean;
}

export const BreachGuardAssistant: React.FC<BreachGuardAssistantProps> = ({
  messages,
  onSendMessage,
  onSelectIncident,
  isTelemetryLive = false
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [speechStatus, setSpeechStatus] = useState<SpeechStatus>(speechService.getStatus());
  const [speakingText, setSpeakingText] = useState<string>(speechService.getCurrentText());
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(speechService.getSettings().voiceEnabled);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastSpokenMsgIdRef = useRef<string | null>(null);

  // Subscribe to speech status updates
  useEffect(() => {
    const unsubscribe = speechService.subscribe((status, currentText) => {
      setSpeechStatus(status);
      setSpeakingText(currentText || '');
      setVoiceEnabled(speechService.getSettings().voiceEnabled);
    });

    return () => {
      unsubscribe();
      speechService.stop();
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  // Autoplay assistant responses when voice is enabled
  useEffect(() => {
    if (messages.length === 0) return;
    const latest = messages[messages.length - 1];

    if (latest.sender === 'agent' && latest.id !== lastSpokenMsgIdRef.current) {
      lastSpokenMsgIdRef.current = latest.id;
      if (voiceEnabled) {
        speechService.speak(latest.text);
      }
    }
  }, [messages, voiceEnabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isProcessing) return;

    // Interrupt any ongoing speech when user submits a new prompt
    speechService.stop();

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
    if (isProcessing) return;
    speechService.stop();

    setIsProcessing(true);
    try {
      await onSendMessage(question);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecuteAction = async (actionKey: string, params?: any) => {
    speechService.stop();
    setIsProcessing(true);
    try {
      const res = await aiAgentOrchestrator.executeSuggestedAction(actionKey, params);
      setActionFeedback(res);
      setTimeout(() => setActionFeedback(null), 5000);
      if (voiceEnabled) {
        speechService.speak(res);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleVoice = () => {
    const updated = speechService.toggleVoice();
    setVoiceEnabled(updated);
  };

  const toggleTechnicalDetails = (msgId: string) => {
    setExpandedDetails(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  const isMsgSpeaking = (text: string) => {
    return speechStatus === 'speaking' && speakingText === text;
  };

  const isMsgPaused = (text: string) => {
    return speechStatus === 'paused' && speakingText === text;
  };

  const quickQuestions = [
    'Is my computer safe?',
    "What's happening right now?",
    'Did you notice anything unusual?',
    'Why did my risk score change?',
    'What is RansomWatch?',
    'Explain this alert',
    'What should I do?',
    'Show me the evidence',
    'Check my protection'
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[740px]">
      
      {/* Left 3 Columns: Interactive Conversational Stream */}
      <div className="lg:col-span-3 bg-card rounded-3xl flex flex-col justify-between overflow-hidden border border-slate-200 shadow-card">
        
        {/* Assistant Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AssistantAvatar 
              size="md" 
              isSpeaking={speechStatus === 'speaking'} 
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">BreachGuard Assistant</h2>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-semibold border flex items-center gap-1 ${
                  isTelemetryLive 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isTelemetryLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                  {isTelemetryLive ? 'Telemetry Grounded' : 'Standby / Telemetry Ready'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Your friendly cybersecurity companion</p>
            </div>
          </div>

          {/* Right Header Controls: Speaking Indicator + Voice Toggle + Settings */}
          <div className="flex items-center gap-2.5">
            {actionFeedback && (
              <div className="hidden sm:flex text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-pulse items-center gap-1.5 shadow-soft">
                <Check className="w-3.5 h-3.5" />
                <span>{actionFeedback}</span>
              </div>
            )}

            <SpeakingIndicator status={speechStatus} showWhenIdle={false} />

            {/* Global Voice Toggle Button */}
            <button
              onClick={handleToggleVoice}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-soft border ${
                voiceEnabled
                  ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                  : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
              }`}
              title={voiceEnabled ? 'Mute assistant voice' : 'Enable assistant voice'}
            >
              {voiceEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>Voice: ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span>Voice: OFF</span>
                </>
              )}
            </button>

            {/* Voice Settings Gear Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200/80 transition-all shadow-soft"
              aria-label="Open voice settings"
              title="Voice Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-5">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isCurrentSpeaking = isMsgSpeaking(msg.text);
            const isCurrentPaused = isMsgPaused(msg.text);
            const isExpanded = !!expandedDetails[msg.id];

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
              >
                {/* Message Header */}
                <div className="flex items-center gap-2 px-1">
                  {isUser ? (
                    <>
                      <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                      <span className="text-[11px] font-semibold text-slate-600">You</span>
                      <div className="p-1 rounded-full bg-brand-100 text-brand-700">
                        <User className="w-3 h-3" />
                      </div>
                    </>
                  ) : (
                    <>
                      <AssistantAvatar size="sm" isSpeaking={isCurrentSpeaking} />
                      <span className="text-[11px] font-bold text-slate-800">BreachGuard Assistant</span>
                      <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                      {isCurrentSpeaking && (
                        <span className="text-[10px] text-purple-600 font-semibold animate-pulse flex items-center gap-1">
                          ● Speaking
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-2xl p-4 sm:p-5 rounded-3xl text-xs sm:text-[13px] leading-relaxed transition-all ${
                    isUser
                      ? 'bg-brand-500 text-white rounded-tr-sm shadow-soft'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-sm shadow-card'
                  }`}
                >
                  <div className="whitespace-pre-line select-text">
                    {msg.text}
                  </div>

                  {/* Technical Details Accordion (For Grounded Evidence) */}
                  {msg.technicalDetails && msg.technicalDetails.length > 0 && (
                    <div className="mt-3.5 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => toggleTechnicalDetails(msg.id)}
                        className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1.5 transition-colors py-1"
                      >
                        <span>{isExpanded ? 'Hide technical details' : 'Show technical details'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono animate-in fade-in duration-150">
                          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 pb-1 border-b border-slate-200 flex items-center justify-between">
                            <span>Verified Security Evidence</span>
                            <span className="text-emerald-700 font-semibold lowercase">grounded</span>
                          </div>
                          <div className="space-y-1.5">
                            {msg.technicalDetails.map((item, dIdx) => (
                              <div key={dIdx} className="flex items-start justify-between gap-3">
                                <span className="text-slate-500 shrink-0 font-sans text-[11px]">{item.label}:</span>
                                <span className={`text-right text-[11px] break-all ${
                                  item.highlight ? 'text-purple-800 font-bold bg-purple-50 px-1.5 py-0.5 rounded' : 'text-slate-800'
                                }`}>
                                  {item.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Suggested Authorized Action Buttons */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                      {msg.suggestedActions.map((action, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => handleExecuteAction(action.actionKey, action.params)}
                          disabled={isProcessing}
                          className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-soft active:scale-95 disabled:opacity-50"
                        >
                          <Zap className="w-3.5 h-3.5 text-purple-600" />
                          <span>{action.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Message Voice Controls Footer */}
                  {!isUser && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1">
                        {/* Replay Button */}
                        <button
                          onClick={() => speechService.replay(msg.text)}
                          className="px-2.5 py-1 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-purple-700 flex items-center gap-1 transition-all"
                          title="Speak this response aloud"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Replay</span>
                        </button>

                        {/* Pause / Resume button if currently playing */}
                        {isCurrentSpeaking && (
                          <button
                            onClick={() => speechService.pause()}
                            className="px-2.5 py-1 rounded-lg hover:bg-amber-50 text-amber-700 flex items-center gap-1 transition-all"
                            title="Pause voice playback"
                          >
                            <Pause className="w-3 h-3" />
                            <span>Pause</span>
                          </button>
                        )}

                        {isCurrentPaused && (
                          <button
                            onClick={() => speechService.resume()}
                            className="px-2.5 py-1 rounded-lg hover:bg-purple-50 text-purple-700 flex items-center gap-1 transition-all"
                            title="Resume voice playback"
                          >
                            <Play className="w-3 h-3" />
                            <span>Resume</span>
                          </button>
                        )}

                        {(isCurrentSpeaking || isCurrentPaused) && (
                          <button
                            onClick={() => speechService.stop()}
                            className="px-2 py-1 rounded-lg hover:bg-rose-50 text-rose-600 flex items-center gap-1 transition-all"
                            title="Stop speaking"
                          >
                            <Square className="w-3 h-3" />
                            <span>Stop</span>
                          </button>
                        )}
                      </div>

                      <span className="text-[10px] text-slate-400 font-sans">
                        BreachGuard Defense AI
                      </span>
                    </div>
                  )}

                </div>
              </div>
            );
          })}

          {/* Thinking State */}
          {isProcessing && (
            <div className="flex items-center gap-3 text-slate-600 text-xs font-sans p-3 bg-white border border-slate-200 rounded-2xl w-fit shadow-soft animate-in fade-in duration-150">
              <AssistantAvatar size="sm" isSpeaking={false} />
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                <span className="font-medium">BreachGuard Assistant is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask me anything about your security (e.g. 'Is my computer safe?', 'What's happening right now?')..."
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-sans pr-24 shadow-soft"
            />
            <button
              type="submit"
              disabled={isProcessing || !inputQuery.trim()}
              className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-soft active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>

      </div>

      {/* Right 1 Column: "How can I help?" Quick Questions */}
      <div className="bg-card p-6 rounded-3xl flex flex-col justify-between space-y-4 border border-slate-200 shadow-card">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-purple-600" />
              <h3 className="font-bold text-slate-900 text-sm">How can I help?</h3>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          </div>

          <p className="text-[11px] text-slate-500">
            Select a common security topic to ask your assistant:
          </p>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickQuestion(q)}
                disabled={isProcessing}
                className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-purple-50/70 border border-slate-200 hover:border-purple-200 text-slate-700 hover:text-purple-950 text-xs transition-all flex items-center justify-between group shadow-soft disabled:opacity-50"
              >
                <span className="pr-2 font-medium leading-tight">{q}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>
        </div>

        {/* Footer info badge */}
        <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5">
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Grounded in verified telemetry</span>
          </div>
          <div className="text-[10px] text-slate-400">
            Natural female voice assistance with zero external cloud dependencies.
          </div>
        </div>
      </div>

      {/* Voice Settings Modal */}
      <VoiceSettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

    </div>
  );
};
