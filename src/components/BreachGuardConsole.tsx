import React, { useState } from 'react';
import { 
  Lock, 
  Search, 
  KeyRound, 
  ShieldAlert, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Globe,
  Database,
  Building
} from 'lucide-react';
import { EmailBreachResult, PasswordBreachResult } from '../types';
import { breachGuardAdapter } from '../adapters/breachguard-adapter';

interface BreachGuardConsoleProps {
  history: EmailBreachResult[];
  onEmailChecked: (result: EmailBreachResult) => void;
}

export const BreachGuardConsole: React.FC<BreachGuardConsoleProps> = ({
  history,
  onEmailChecked
}) => {
  // Email Check State
  const [emailInput, setEmailInput] = useState('');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [latestEmailResult, setLatestEmailResult] = useState<EmailBreachResult | null>(history[0] || null);

  // Password Check State
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);
  const [passwordResult, setPasswordResult] = useState<PasswordBreachResult | null>(null);

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setIsCheckingEmail(true);
    try {
      const result = await breachGuardAdapter.checkEmail(emailInput);
      setLatestEmailResult(result);
      onEmailChecked(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleCheckPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput) return;

    setIsCheckingPassword(true);
    try {
      const result = await breachGuardAdapter.checkPasswordKAnonymity(passwordInput);
      setPasswordResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCheckingPassword(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 shadow-glow-purple">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Breach Guard Identity & Credential Intelligence
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/50">
                Next.js 16 API (Port 3000)
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Zero-knowledge identity exposure checks + k-Anonymity cryptographic password verification
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>k-Anonymity: ACTIVE (SHA-1 prefix range queries)</span>
        </div>
      </div>

      {/* Top Section: Two Key Tools (Email Breach Scanner + k-Anonymity Password Scanner) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Tool 1: Email Exposure Scanner */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Email Exposure Scanner</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">XposedOrNot + Curated Metadata</span>
          </div>

          <form onSubmit={handleCheckEmail} className="flex gap-2">
            <input
              type="email"
              placeholder="e.g. admin@enterprise-corp.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="flex-1 bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
              required
            />
            <button
              type="submit"
              disabled={isCheckingEmail}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow-purple transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isCheckingEmail ? (
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>Check Email</span>
            </button>
          </form>

          {/* Result Card */}
          {latestEmailResult && (
            <div className={`p-4 rounded-xl border transition-all ${
              latestEmailResult.exposed 
                ? 'bg-rose-950/30 border-rose-800/80' 
                : 'bg-emerald-950/30 border-emerald-800/80'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {latestEmailResult.exposed ? (
                    <ShieldAlert className="w-5 h-5 text-rose-400" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  )}
                  <span className="text-xs font-bold text-white font-mono truncate max-w-[200px]">
                    {latestEmailResult.email}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  latestEmailResult.exposed ? 'bg-rose-900 text-rose-200' : 'bg-emerald-900 text-emerald-200'
                }`}>
                  {latestEmailResult.exposed ? `${latestEmailResult.breaches.length} BREACHES DETECTED` : 'CLEAN'}
                </span>
              </div>

              {latestEmailResult.exposed ? (
                <div className="space-y-3">
                  <p className="text-xs text-rose-200">
                    This account credentials have been dumped across <strong>{latestEmailResult.breaches.length}</strong> public database breaches.
                  </p>
                  
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {latestEmailResult.enrichedBreaches.map((breach, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{breach.title || breach.name}</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {breach.breachDate}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2">
                          {breach.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {breach.dataClasses.map((dc, i) => (
                            <span key={i} className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                              dc.toLowerCase().includes('password') ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-300'
                            }`}>
                              {dc}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-emerald-300">
                  No public breach exposures detected for this identity across dark web monitoring indexes.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Tool 2: k-Anonymity Password Scanner */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-purple-400" />
              <div>
                <h3 className="text-sm font-bold text-white">k-Anonymity Password Scanner</h3>
                <p className="text-[11px] text-slate-400">Zero-knowledge SHA-1 prefix comparison (lib/hibp.ts)</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded">
              Privacy Guaranteed
            </span>
          </div>

          <form onSubmit={handleCheckPassword} className="space-y-3">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password to test breach count..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isCheckingPassword}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-glow-purple transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isCheckingPassword ? (
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <KeyRound className="w-4 h-4" />
              )}
              <span>Evaluate k-Anonymity Range</span>
            </button>
          </form>

          {/* Cryptographic Demonstration Box */}
          {passwordResult && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-purple-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Cryptographic Breakdown</span>
                <span className="text-[10px] font-mono text-slate-400">{passwordResult.evaluationTimeMs}ms execution</span>
              </div>

              {/* Masked Hash Diagram */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs">
                <div className="text-[10px] text-slate-400 mb-1">Local Browser SHA-1 Hash:</div>
                <div className="flex items-center gap-1">
                  <span className="bg-purple-950 text-purple-300 font-bold px-1.5 py-0.5 rounded border border-purple-700">
                    {passwordResult.sha1Prefix}
                  </span>
                  <span className="text-slate-500">
                    ***********************************
                  </span>
                </div>
                <div className="text-[9px] text-slate-400 mt-1">
                  &uarr; <strong className="text-purple-300">Sent to API (5 hex)</strong> | <strong className="text-slate-400">Never leaves browser (35 hex)</strong>
                </div>
              </div>

              {/* Exposure Verdict */}
              <div className={`p-3 rounded-lg border ${
                passwordResult.exposed 
                  ? 'bg-rose-950/40 border-rose-800 text-rose-200' 
                  : 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">
                    {passwordResult.exposed ? '🚨 EXPOSED IN BREACHES' : '✅ NOT FOUND IN KNOWN BREACHES'}
                  </span>
                  {passwordResult.exposed && (
                    <span className="text-xs font-mono font-bold">
                      {passwordResult.breachCount.toLocaleString()} Occurrences
                    </span>
                  )}
                </div>
                <p className="text-[11px] mt-1 opacity-90">
                  {passwordResult.exposed 
                    ? 'This password was found in past credential dumps. Threat actors actively use it in automated dictionary attacks.'
                    : 'This password was not identified in known dumps. Continue using strong unique combinations.'}
                </p>
              </div>
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300 block">How k-Anonymity Protects You:</span>
            <p>
              By sending only a 5-character prefix, the HIBP server returns hundreds of matching hashes without knowing which one is yours. The final match is computed 100% locally in your browser.
            </p>
          </div>
        </div>

      </div>

      {/* Bottom Section: Data Broker Removal & GDPR Rights Helper */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Data Broker Opt-Out & GDPR Rights Wizard</h3>
              <p className="text-[11px] text-slate-400">Proactively delete your enterprise information from public scraper indexes</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded">
            GDPR Article 17 (Right to Erasure)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
            <span className="font-bold text-white">1. Whitepages / Spokeo</span>
            <p className="text-[11px] text-slate-400">People-search directory scraping residential and contact metadata.</p>
            <span className="inline-block text-[10px] text-cyan-400 font-mono">&rarr; Automated Opt-Out Guide</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
            <span className="font-bold text-white">2. Apollo.io / ZoomInfo</span>
            <p className="text-[11px] text-slate-400">B2B intelligence databases indexing corporate roles and work emails.</p>
            <span className="inline-block text-[10px] text-cyan-400 font-mono">&rarr; Corporate Privacy Request</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
            <span className="font-bold text-white">3. LexisNexis / Acxiom</span>
            <p className="text-[11px] text-slate-400">Enterprise data aggregator collecting financial and identification records.</p>
            <span className="inline-block text-[10px] text-cyan-400 font-mono">&rarr; GDPR Erasure Template</span>
          </div>
        </div>
      </div>

    </div>
  );
};
