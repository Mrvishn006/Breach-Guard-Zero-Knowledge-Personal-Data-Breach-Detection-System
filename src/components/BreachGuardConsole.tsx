import React, { useState, useEffect } from 'react';
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
  Building, 
  Copy, 
  Check, 
  Send, 
  UserX, 
  FileCheck2, 
  Calendar 
} from 'lucide-react';
import { EmailBreachResult, PasswordBreachResult, DataBrokerEntry, GdprRequestPayload } from '../types';
import { breachGuardAdapter } from '../adapters/breachguard-adapter';

interface BreachGuardConsoleProps {
  history: EmailBreachResult[];
  onEmailChecked: (result: EmailBreachResult) => void;
}

export const BreachGuardConsole: React.FC<BreachGuardConsoleProps> = ({
  history,
  onEmailChecked
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'verify' | 'timeline' | 'databrokers' | 'gdpr'>('verify');

  // Email Check State
  const [emailInput, setEmailInput] = useState('');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [latestEmailResult, setLatestEmailResult] = useState<EmailBreachResult | null>(history[0] || null);

  // Password Check State
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);
  const [passwordResult, setPasswordResult] = useState<PasswordBreachResult | null>(null);

  // Data Brokers State
  const [dataBrokers, setDataBrokers] = useState<DataBrokerEntry[]>([]);
  const [brokerFilter, setBrokerFilter] = useState('');

  // GDPR Notice Generator State
  const [gdprPayload, setGdprPayload] = useState<GdprRequestPayload>({
    fullName: '',
    email: '',
    targetCompany: '',
    requestType: 'ERASURE'
  });
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [copiedLetter, setCopiedLetter] = useState(false);

  useEffect(() => {
    breachGuardAdapter.getDataBrokers().then(setDataBrokers);
  }, []);

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setIsCheckingEmail(true);
    const result = await breachGuardAdapter.checkEmail(emailInput);
    setLatestEmailResult(result);
    onEmailChecked(result);
    setIsCheckingEmail(false);
  };

  const handleCheckPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput) return;

    setIsCheckingPassword(true);
    const result = await breachGuardAdapter.checkPasswordKAnonymity(passwordInput);
    setPasswordResult(result);
    setIsCheckingPassword(false);
  };

  const handleGenerateGdpr = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = await breachGuardAdapter.generateGdprLetter(gdprPayload);
    setGeneratedLetter(text);
  };

  const handleCopyLetter = () => {
    if (!generatedLetter) return;
    navigator.clipboard.writeText(generatedLetter);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Breach Guard Intelligence Console</h1>
          </div>
          <p className="text-slate-400 text-sm">
            Zero-Knowledge credential analysis via <span className="text-indigo-400 font-semibold font-mono">k-Anonymity</span>, privacy-preserving email verification, and GDPR remediation.
          </p>
        </div>

        {/* Sub Navigation Pills */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('verify')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSubTab === 'verify' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Scanner & k-Anonymity
          </button>
          <button
            onClick={() => setActiveSubTab('timeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSubTab === 'timeline' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Exposure Timeline
          </button>
          <button
            onClick={() => setActiveSubTab('databrokers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSubTab === 'databrokers' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Data Broker Opt-Out
          </button>
          <button
            onClick={() => setActiveSubTab('gdpr')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSubTab === 'gdpr' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            GDPR Remediation
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: Verification (Email + Password k-Anonymity) */}
      {activeSubTab === 'verify' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Email Breach Verification */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-base font-semibold text-white">Email Exposure Scanner</h2>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 text-indigo-300 font-mono border border-slate-700">
                  Rate-Limited Proxy
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Queries aggregated breach indexes through a secured proxy with input sanitization, rate limiting, and hashed response caching.
              </p>

              <form onSubmit={handleCheckEmail} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter email address (e.g. employee@company.com)..."
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isCheckingEmail}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white text-xs font-medium transition-all flex items-center gap-1.5"
                  >
                    {isCheckingEmail ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Search className="w-3.5 h-3.5" />
                        <span>Scan</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Email Scan Result Display */}
              {latestEmailResult ? (
                <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono truncate max-w-[220px]">
                      {latestEmailResult.email}
                    </span>
                    {latestEmailResult.exposed ? (
                      <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        {latestEmailResult.breaches.length} Breaches Found
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        No Known Exposures
                      </span>
                    )}
                  </div>

                  {latestEmailResult.exposed && (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {latestEmailResult.enrichedBreaches.map((b, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-200">{b.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{b.breachDate}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2">{b.description}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {b.dataClasses.map((cls, cIdx) => (
                              <span key={cIdx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono">
                                {cls}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-slate-800 text-center py-6 text-slate-500 space-y-1">
                  <Lock className="w-5 h-5 text-indigo-400 mx-auto opacity-60" />
                  <p className="text-xs text-slate-300 font-medium">NO BREACH CHECK PERFORMED</p>
                  <p className="text-[11px] text-slate-500">Enter an email address above to check exposed records with zero-knowledge proxy.</p>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-500 font-mono mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
              <span>🔒 Query cached using SHA-256 key</span>
              <span>Zero user tracking</span>
            </div>
          </div>

          {/* Zero-Knowledge k-Anonymity Password Verifier */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-base font-semibold text-white">Password k-Anonymity Verifier</h2>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/30">
                  Zero-Knowledge
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Your raw password <strong className="text-slate-200">never leaves your device</strong>. Hashed locally via SHA-1, only the 5-character prefix is sent to evaluate against billions of leaked credentials.
              </p>

              <form onSubmit={handleCheckPassword} className="space-y-3">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter password to evaluate..."
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono pr-20"
                    required
                  />
                  <div className="absolute right-1.5 top-1.5 bottom-1.5 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1.5 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      type="submit"
                      disabled={isCheckingPassword}
                      className="px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white text-xs font-medium transition-all"
                    >
                      {isCheckingPassword ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        'Test'
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {/* Password Result */}
              {passwordResult ? (
                <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 font-mono text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Transmitted Prefix:</span>
                      <span className="text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/30">
                        {passwordResult.sha1Prefix}***** (SHA-1)
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Local Verification Time:</span>
                      <span className="text-slate-300">{passwordResult.evaluationTimeMs.toFixed(1)} ms</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                      <span className="text-slate-400">Exposure Status:</span>
                      {passwordResult.exposed ? (
                        <span className="text-rose-400 font-bold">
                          Compromised in {passwordResult.breachCount.toLocaleString()} breaches
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-bold">Clean / Not Found in Dumps</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-slate-800 text-center py-6 text-slate-500 space-y-1">
                  <KeyRound className="w-5 h-5 text-indigo-400 mx-auto opacity-60" />
                  <p className="text-xs text-slate-300 font-medium">AWAITING PASSWORD EVALUATION</p>
                  <p className="text-[11px] text-slate-500">Test any password locally with mathematical k-Anonymity protection.</p>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-500 font-mono mt-4 pt-3 border-t border-slate-800/60">
              <span>🛡️ RFC 7519 / k-Anonymity Mathematical Proof Verified</span>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 2: Exposure Timeline */}
      {activeSubTab === 'timeline' && (
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-semibold text-white">Chronological Identity Exposure Timeline</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Aggregated across {history.length} evaluated domains
            </span>
          </div>

          {history.length === 0 ? (
            <div className="p-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl space-y-2">
              <Clock className="w-6 h-6 text-indigo-400 mx-auto opacity-60" />
              <p className="text-xs text-slate-300 font-medium">No Breaches Checked in Active Session</p>
              <p className="text-[11px] text-slate-500">Scan an email address in the Scanner tab to view chronological breach timeline and affected data classes.</p>
            </div>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {history.flatMap(h => h.enrichedBreaches.map(b => ({ ...b, email: h.email }))).map((item, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-indigo-500 group-hover:bg-indigo-400 transition-all" />
                  <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200 text-sm">{item.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          item.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}>
                          {item.severity}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Breached: {item.breachDate} &bull; Recorded: {item.addedDate}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">{item.description}</p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-[11px]">Compromised Records:</span>
                        <span className="text-slate-300 font-mono font-semibold">{item.pwnCount.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.dataClasses.map((cls, cIdx) => (
                          <span key={cIdx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono">
                            {cls}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: Data Broker Opt-Out Directory */}
      {activeSubTab === 'databrokers' && (
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <UserX className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-semibold text-white">Data Broker Opt-Out & Suppression Directory</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Direct removal procedures to suppress exposed PII and corporate credentials from major public data aggregators.
              </p>
            </div>

            <input
              type="text"
              value={brokerFilter}
              onChange={(e) => setBrokerFilter(e.target.value)}
              placeholder="Search brokers (e.g. Acxiom, LexisNexis)..."
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-full sm:w-64 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataBrokers
              .filter(b => b.name.toLowerCase().includes(brokerFilter.toLowerCase()) || b.category.toLowerCase().includes(brokerFilter.toLowerCase()))
              .map((broker, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-sm flex items-center gap-2">
                        <Building className="w-4 h-4 text-indigo-400" />
                        {broker.name}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {broker.estimatedRemovalDays}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{broker.category}</p>
                    
                    <div className="pt-2 text-xs space-y-1">
                      <div className="text-slate-400"><strong className="text-slate-300">Method:</strong> {broker.method}</div>
                      <div className="text-slate-400"><strong className="text-slate-300">Legal Basis:</strong> {broker.legalBasis}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {broker.dataCollected.map((d, dIdx) => (
                          <span key={dIdx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <a
                    href={broker.optOutUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 w-full py-2 px-3 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Proceed to Official Opt-Out Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: GDPR Remediation Notice Generator */}
      {activeSubTab === 'gdpr' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Generator Form */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-semibold text-white">GDPR Compliance Notice Generator</h2>
            </div>
            <p className="text-xs text-slate-400">
              Generate legally binding notices under <strong>Article 17 (Right to Erasure)</strong> or <strong>Article 15 (Subject Access Request)</strong> to compel breached platforms to delete or disclose your personal data.
            </p>

            <form onSubmit={handleGenerateGdpr} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Request Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGdprPayload({ ...gdprPayload, requestType: 'ERASURE' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                      gdprPayload.requestType === 'ERASURE'
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    Article 17: Right to Erasure
                  </button>
                  <button
                    type="button"
                    onClick={() => setGdprPayload({ ...gdprPayload, requestType: 'ACCESS' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                      gdprPayload.requestType === 'ACCESS'
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    Article 15: Access Request
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Your Full Legal Name</label>
                <input
                  type="text"
                  value={gdprPayload.fullName}
                  onChange={(e) => setGdprPayload({ ...gdprPayload, fullName: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Associated Account Email</label>
                <input
                  type="email"
                  value={gdprPayload.email}
                  onChange={(e) => setGdprPayload({ ...gdprPayload, email: e.target.value })}
                  placeholder="e.g. john.doe@domain.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Target Breached Organization / Broker</label>
                <input
                  type="text"
                  value={gdprPayload.targetCompany}
                  onChange={(e) => setGdprPayload({ ...gdprPayload, targetCompany: e.target.value })}
                  placeholder="e.g. Acxiom Inc / Dropbox LLC"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all mt-2"
              >
                <Send className="w-4 h-4" />
                <span>Generate Legal Compliance Notice</span>
              </button>
            </form>
          </div>

          {/* Letter Output Display */}
          <div className="glass-panel p-6 rounded-2xl space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-semibold text-white">Generated Legal Notice Artifact</h3>
                </div>
                {generatedLetter && (
                  <button
                    onClick={handleCopyLetter}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-mono border border-slate-700 transition-all"
                  >
                    {copiedLetter ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Notice</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 h-80 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {generatedLetter || 'Fill out the form on the left to generate your customized Article 17 Erasure Notice or Article 15 SAR letter.'}
              </div>
            </div>

            <p className="text-[11px] text-slate-500 font-mono">
              Mandated compliance period: 30 days under GDPR Article 12(3) / CCPA Section 1798.130.
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
