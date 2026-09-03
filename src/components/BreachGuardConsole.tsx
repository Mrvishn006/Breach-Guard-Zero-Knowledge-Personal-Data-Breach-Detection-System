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
      
      {/* 1. Header Banner */}
      <div className="bg-card p-6 rounded-3xl border border-slate-200 shadow-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 shadow-soft">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Breach Guard Intelligence Console</h1>
          </div>
          <p className="text-slate-500 text-xs">
            Zero-Knowledge credential analysis via <span className="text-indigo-600 font-semibold font-mono">k-Anonymity</span>, privacy-preserving email verification, and GDPR remediation.
          </p>
        </div>

        {/* Sub-Navigation Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveSubTab('verify')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'verify' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Scanner & k-Anonymity
          </button>
          <button
            onClick={() => setActiveSubTab('timeline')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'timeline' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Exposure Timeline
          </button>
          <button
            onClick={() => setActiveSubTab('databrokers')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'databrokers' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Data Broker Opt-Out
          </button>
          <button
            onClick={() => setActiveSubTab('gdpr')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'gdpr' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            GDPR Remediation
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: Verification (Email + Password k-Anonymity) */}
      {activeSubTab === 'verify' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Email Exposure Scanner */}
          <div className="bg-card p-6 rounded-3xl border border-slate-200 shadow-card flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-indigo-600" />
                  <h2 className="text-sm font-bold text-slate-900">Email Exposure Scanner</h2>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-mono font-semibold border border-indigo-200">
                  Rate-Limited Proxy
                </span>
              </div>

              <p className="text-xs text-slate-500">
                Queries aggregated breach indexes through a secured proxy with input sanitization, rate limiting, and hashed response caching.
              </p>

              <form onSubmit={handleCheckEmail} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter email address (e.g. employee@company.com)..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isCheckingEmail}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-soft"
                  >
                    {isCheckingEmail ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-mono truncate max-w-[220px]">
                      {latestEmailResult.email}
                    </span>
                    {latestEmailResult.exposed ? (
                      <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        {latestEmailResult.breaches.length} Breaches Found
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        No Known Exposures
                      </span>
                    )}
                  </div>

                  {latestEmailResult.exposed && (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {latestEmailResult.enrichedBreaches.map((b, idx) => (
                        <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-900">{b.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{b.breachDate}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-2">{b.description}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {b.dataClasses.map((cls, cIdx) => (
                              <span key={cIdx} className="text-[9px] px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-indigo-700 font-mono font-medium">
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
                <div className="mt-4 pt-4 border-t border-slate-100 text-center py-8 text-slate-400 space-y-1.5 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <Lock className="w-6 h-6 text-indigo-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">No breach check performed</p>
                  <p className="text-[11px] text-slate-400">Enter an email address above to check exposed records with zero-knowledge proxy.</p>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-400 font-mono pt-3 border-t border-slate-100 flex items-center justify-between">
              <span>🔒 Query cached using SHA-256 key</span>
              <span>Zero user tracking</span>
            </div>
          </div>

          {/* Zero-Knowledge k-Anonymity Password Verifier */}
          <div className="bg-card p-6 rounded-3xl border border-slate-200 shadow-card flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-indigo-600" />
                  <h2 className="text-sm font-bold text-slate-900">Password k-Anonymity Verifier</h2>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono font-bold border border-emerald-200">
                  Zero-Knowledge
                </span>
              </div>

              <p className="text-xs text-slate-500">
                Your raw password <strong className="text-slate-800">never leaves your device</strong>. Hashed locally via SHA-1, only the 5-character prefix is sent to evaluate against leaked credentials.
              </p>

              <form onSubmit={handleCheckPassword} className="space-y-3">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter password to evaluate..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono pr-20"
                    required
                  />
                  <div className="absolute right-1.5 top-1.5 bottom-1.5 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      type="submit"
                      disabled={isCheckingPassword}
                      className="px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-semibold transition-all shadow-soft"
                    >
                      {isCheckingPassword ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        'Test'
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {/* Password Result */}
              {passwordResult ? (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 font-mono text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Transmitted Prefix:</span>
                      <span className="text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                        {passwordResult.sha1Prefix}***** (SHA-1)
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Local Verification Time:</span>
                      <span className="text-slate-800 font-semibold">{passwordResult.evaluationTimeMs.toFixed(1)} ms</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                      <span className="text-slate-500">Exposure Status:</span>
                      {passwordResult.exposed ? (
                        <span className="text-rose-700 font-bold">
                          Compromised in {passwordResult.breachCount.toLocaleString()} breaches
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-bold">Clean / Not Found in Dumps</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-slate-100 text-center py-8 text-slate-400 space-y-1.5 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <KeyRound className="w-6 h-6 text-indigo-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">Awaiting password evaluation</p>
                  <p className="text-[11px] text-slate-400">Test any password locally with mathematical k-Anonymity protection.</p>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-400 font-mono pt-3 border-t border-slate-100">
              <span>🛡️ RFC 7519 / k-Anonymity Mathematical Proof Verified</span>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 2: Exposure Timeline */}
      {activeSubTab === 'timeline' && (
        <div className="bg-card p-6 rounded-3xl border border-slate-200 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">Chronological Identity Exposure Timeline</h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Aggregated across {history.length} evaluated domains
            </span>
          </div>

          {history.length === 0 ? (
            <div className="p-12 text-center text-slate-500 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-2">
              <Clock className="w-7 h-7 text-indigo-500 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">No Breaches Checked in Active Session</p>
              <p className="text-[11px] text-slate-400">Scan an email address in the Scanner tab to view chronological breach timeline and affected data classes.</p>
            </div>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {history.flatMap(h => h.enrichedBreaches.map(b => ({ ...b, email: h.email }))).map((item, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-indigo-600 group-hover:bg-indigo-600 transition-all shadow-sm" />
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          item.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {item.severity}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Breached: {item.breachDate} &bull; Recorded: {item.addedDate}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">{item.description}</p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-[11px]">Compromised Records:</span>
                        <span className="text-slate-800 font-mono font-bold">{item.pwnCount.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.dataClasses.map((cls, cIdx) => (
                          <span key={cIdx} className="text-[9px] px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-indigo-700 font-mono font-medium">
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
        <div className="bg-card p-6 rounded-3xl border border-slate-200 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <UserX className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-900">Data Broker Opt-Out & Suppression Directory</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct removal procedures to suppress exposed PII and corporate credentials from public data aggregators.
              </p>
            </div>

            <input
              type="text"
              value={brokerFilter}
              onChange={(e) => setBrokerFilter(e.target.value)}
              placeholder="Search brokers (e.g. Acxiom)..."
              className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 w-full sm:w-64 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataBrokers
              .filter(b => b.name.toLowerCase().includes(brokerFilter.toLowerCase()) || b.category.toLowerCase().includes(brokerFilter.toLowerCase()))
              .map((broker, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <Building className="w-4 h-4 text-indigo-600" />
                        {broker.name}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 font-mono font-medium">
                        {broker.estimatedRemovalDays}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{broker.category}</p>
                    
                    <div className="pt-2 text-xs space-y-1">
                      <div className="text-slate-600"><strong className="text-slate-800">Method:</strong> {broker.method}</div>
                      <div className="text-slate-600"><strong className="text-slate-800">Legal Basis:</strong> {broker.legalBasis}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {broker.dataCollected.map((d, dIdx) => (
                          <span key={dIdx} className="text-[9px] px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
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
                    className="mt-2 w-full py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-soft"
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
          <div className="bg-card p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">GDPR Compliance Notice Generator</h2>
            </div>
            <p className="text-xs text-slate-500">
              Generate legally binding notices under <strong>Article 17 (Right to Erasure)</strong> or <strong>Article 15 (Subject Access Request)</strong>.
            </p>

            <form onSubmit={handleGenerateGdpr} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Request Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGdprPayload({ ...gdprPayload, requestType: 'ERASURE' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      gdprPayload.requestType === 'ERASURE'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-soft'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white'
                    }`}
                  >
                    Article 17: Right to Erasure
                  </button>
                  <button
                    type="button"
                    onClick={() => setGdprPayload({ ...gdprPayload, requestType: 'ACCESS' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      gdprPayload.requestType === 'ACCESS'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-soft'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white'
                    }`}
                  >
                    Article 15: Access Request
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Your Full Legal Name</label>
                <input
                  type="text"
                  value={gdprPayload.fullName}
                  onChange={(e) => setGdprPayload({ ...gdprPayload, fullName: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Associated Account Email</label>
                <input
                  type="email"
                  value={gdprPayload.email}
                  onChange={(e) => setGdprPayload({ ...gdprPayload, email: e.target.value })}
                  placeholder="e.g. john.doe@domain.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Target Organization / Broker</label>
                <input
                  type="text"
                  value={gdprPayload.targetCompany}
                  onChange={(e) => setGdprPayload({ ...gdprPayload, targetCompany: e.target.value })}
                  placeholder="e.g. Acxiom Inc / Dropbox LLC"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-2 shadow-soft transition-all mt-2"
              >
                <Send className="w-4 h-4" />
                <span>Generate Legal Compliance Notice</span>
              </button>
            </form>
          </div>

          {/* Letter Output Display */}
          <div className="bg-card p-6 rounded-3xl border border-slate-200 shadow-card space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Generated Legal Notice</h3>
                </div>
                {generatedLetter && (
                  <button
                    onClick={handleCopyLetter}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-indigo-700 text-xs font-mono font-semibold border border-slate-200 transition-all shadow-soft"
                  >
                    {copiedLetter ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
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

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-800 h-80 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {generatedLetter || 'Fill out the form on the left to generate your customized Article 17 Erasure Notice or Article 15 SAR letter.'}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 font-mono">
              Mandated compliance period: 30 days under GDPR Article 12(3) / CCPA Section 1798.130.
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
