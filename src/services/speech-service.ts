import { VoiceSettings, SpeechStatus } from '../types';

type SpeechStatusListener = (status: SpeechStatus, currentText?: string) => void;

const STORAGE_KEY = 'breachguard_assistant_voice_settings';

const DEFAULT_SETTINGS: VoiceSettings = {
  voiceEnabled: true,
  selectedVoiceURI: '',
  rate: 1.0,
  pitch: 1.0,
  volume: 1.0
};

class SpeechService {
  private status: SpeechStatus = 'idle';
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentText: string = '';
  private listeners: Set<SpeechStatusListener> = new Set();
  private voices: SpeechSynthesisVoice[] = [];
  private settings: VoiceSettings = { ...DEFAULT_SETTINGS };
  private heartbeatTimer: any = null;
  private isVoicesLoaded: boolean = false;

  constructor() {
    this.loadSettings();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
    } else {
      this.status = 'unavailable';
    }
  }

  private loadSettings() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          this.settings = {
            voiceEnabled: typeof parsed.voiceEnabled === 'boolean' ? parsed.voiceEnabled : true,
            selectedVoiceURI: typeof parsed.selectedVoiceURI === 'string' ? parsed.selectedVoiceURI : '',
            rate: typeof parsed.rate === 'number' ? Math.max(0.8, Math.min(1.2, parsed.rate)) : 1.0,
            pitch: 1.0,
            volume: typeof parsed.volume === 'number' ? Math.max(0.0, Math.min(1.0, parsed.volume)) : 1.0
          };
        }
      }
    } catch (e) {
      console.warn('[SpeechService] Error loading voice settings from localStorage:', e);
    }
  }

  private saveSettings() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
      }
    } catch (e) {
      console.warn('[SpeechService] Error saving voice settings:', e);
    }
  }

  private initVoices() {
    try {
      const load = () => {
        const available = window.speechSynthesis.getVoices();
        if (available && available.length > 0) {
          this.voices = available;
          this.isVoicesLoaded = true;
          this.notifyListeners();
        }
      };

      load();
      if ('onvoiceschanged' in window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = () => {
          load();
        };
      }

      // Fallback timers if onvoiceschanged doesn't trigger immediately
      setTimeout(load, 500);
      setTimeout(load, 1500);
    } catch (e) {
      console.warn('[SpeechService] Voice discovery error:', e);
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    if (this.voices.length === 0) {
      this.voices = window.speechSynthesis.getVoices() || [];
    }
    return this.voices;
  }

  /**
   * Score a voice based on how well it matches the desired natural female English voice profile
   */
  public scoreVoice(voice: SpeechSynthesisVoice): number {
    let score = 0;
    const name = voice.name.toLowerCase();
    const lang = voice.lang.toLowerCase();

    // 1. Must be English
    if (lang.startsWith('en')) {
      score += 50;
      if (lang === 'en-us' || lang === 'en-gb') score += 10;
    } else {
      // Non-English gets a strong penalty
      return 0;
    }

    // 2. High quality / Natural indicator
    if (name.includes('natural') || name.includes('online') || name.includes('neural')) {
      score += 40;
    }

    // 3. Known pleasant female voice names on Windows / macOS / Web
    const femaleKeywords = [
      'jenny', 'aria', 'zira', 'hazel', 'samantha', 'victoria', 
      'susan', 'catherine', 'heera', 'ava', 'emma', 'olivia', 
      'sonia', 'female', 'woman', 'girl'
    ];

    if (femaleKeywords.some(kw => name.includes(kw))) {
      score += 60;
    }

    // Explicit male indicators get a penalty
    const maleKeywords = ['david', 'george', 'mark', 'richard', 'james', 'guy', 'male', 'man', 'boy'];
    if (maleKeywords.some(kw => name.includes(kw))) {
      score -= 40;
    }

    // Default system voice bonus
    if (voice.default) {
      score += 5;
    }

    return Math.max(0, score);
  }

  public getBestFemaleVoice(): SpeechSynthesisVoice | null {
    const all = this.getVoices();
    if (all.length === 0) return null;

    // Sort by score descending
    const sorted = [...all].sort((a, b) => this.scoreVoice(b) - this.scoreVoice(a));
    return sorted[0] || null;
  }

  public getSelectedVoice(): SpeechSynthesisVoice | null {
    const all = this.getVoices();
    if (all.length === 0) return null;

    if (this.settings.selectedVoiceURI) {
      const found = all.find(v => v.voiceURI === this.settings.selectedVoiceURI);
      if (found) return found;
    }

    return this.getBestFemaleVoice();
  }

  /**
   * Sanitizes markdown, symbols, and technical abbreviations for natural, smooth speech
   */
  public sanitizeForSpeech(text: string): string {
    if (!text) return '';

    let clean = text;

    // Remove markdown code blocks completely if they contain raw code
    clean = clean.replace(/```[\s\S]*?```/g, ' ');

    // Replace specific technical terms with natural spoken pronunciation
    clean = clean.replace(/FsFilter\.sys/gi, 'FsFilter driver');
    clean = clean.replace(/\\\\RWFilterPort|\\RWFilterPort/gi, 'the R W Filter Port');
    clean = clean.replace(/\bGID\b/g, 'process group ID');
    clean = clean.replace(/\bPID\b/g, 'process ID');
    clean = clean.replace(/\bPIDs\b/g, 'process IDs');
    clean = clean.replace(/IRP_MJ_WRITE/gi, 'file write operation');
    clean = clean.replace(/IRP_MJ_CREATE/gi, 'file create operation');
    clean = clean.replace(/IRP_MJ_SET_INFORMATION/gi, 'file rename operation');
    clean = clean.replace(/IRP_MJ_READ/gi, 'file read operation');
    clean = clean.replace(/k-Anonymity/gi, 'K anonymity');
    clean = clean.replace(/SHA-1/gi, 'SHA one');
    clean = clean.replace(/RCA/gi, 'root cause analysis');
    clean = clean.replace(/SOC/gi, 'security center');
    clean = clean.replace(/GDPR/gi, 'G D P R');

    // Remove markdown bold, italic, code markers, headers, quotes, list markers
    clean = clean.replace(/\*\*([^*]+)\*\*/g, '$1');
    clean = clean.replace(/\*([^*]+)\*/g, '$1');
    clean = clean.replace(/__([^_]+)__/g, '$1');
    clean = clean.replace(/_([^_]+)_/g, '$1');
    clean = clean.replace(/`([^`]+)`/g, '$1');
    clean = clean.replace(/^#+\s+/gm, '');
    clean = clean.replace(/^>\s+/gm, '');
    clean = clean.replace(/^[\s]*[-*•]\s+/gm, '');
    clean = clean.replace(/^[\s]*\d+\.\s+/gm, '');

    // Remove common emojis to prevent robotic emoji reading
    clean = clean.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F100}-\u{1F1FF}]/gu, '');

    // Replace multiple spaces and newlines with a single space or pause
    clean = clean.replace(/\n+/g, '. ');
    clean = clean.replace(/\s{2,}/g, ' ');

    return clean.trim();
  }

  public speak(rawText: string, onDone?: () => void): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.status = 'unavailable';
      this.notifyListeners();
      if (onDone) onDone();
      return false;
    }

    // Always cancel previous speech cleanly
    this.stop();

    if (!this.settings.voiceEnabled) {
      this.status = 'idle';
      this.notifyListeners();
      if (onDone) onDone();
      return true;
    }

    const spokenText = this.sanitizeForSpeech(rawText);
    if (!spokenText) {
      this.status = 'idle';
      this.notifyListeners();
      if (onDone) onDone();
      return true;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(spokenText);
      const voice = this.getSelectedVoice();
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang || 'en-US';
      } else {
        utterance.lang = 'en-US';
      }

      utterance.rate = this.settings.rate;
      utterance.pitch = this.settings.pitch;
      utterance.volume = this.settings.volume;

      utterance.onstart = () => {
        this.status = 'speaking';
        this.currentText = rawText;
        this.startHeartbeat();
        this.notifyListeners();
      };

      utterance.onpause = () => {
        this.status = 'paused';
        this.notifyListeners();
      };

      utterance.onresume = () => {
        this.status = 'speaking';
        this.notifyListeners();
      };

      utterance.onend = () => {
        this.clearHeartbeat();
        this.status = 'idle';
        this.currentUtterance = null;
        this.currentText = '';
        this.notifyListeners();
        if (onDone) onDone();
      };

      utterance.onerror = (e) => {
        // If cancelled or interrupted intentionally, don't flag as failure
        if (e.error === 'canceled' || e.error === 'interrupted') {
          this.status = 'idle';
        } else {
          console.warn('[SpeechService] Utterance error:', e.error);
          this.status = 'error';
        }
        this.clearHeartbeat();
        this.currentUtterance = null;
        this.notifyListeners();
        if (onDone) onDone();
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err) {
      console.warn('[SpeechService] Speak execution failed:', err);
      this.status = 'error';
      this.notifyListeners();
      if (onDone) onDone();
      return false;
    }
  }

  public pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (this.status === 'speaking') {
        window.speechSynthesis.pause();
        this.status = 'paused';
        this.notifyListeners();
      }
    }
  }

  public resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (this.status === 'paused') {
        window.speechSynthesis.resume();
        this.status = 'speaking';
        this.notifyListeners();
      }
    }
  }

  public stop() {
    this.clearHeartbeat();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    this.status = 'idle';
    this.currentUtterance = null;
    this.currentText = '';
    this.notifyListeners();
  }

  public replay(rawText: string) {
    this.speak(rawText);
  }

  public testVoice(voiceURI?: string) {
    const testText = "Hi! I'm your BreachGuard Assistant, your friendly cybersecurity companion.";
    const prevURI = this.settings.selectedVoiceURI;
    if (voiceURI) {
      this.settings.selectedVoiceURI = voiceURI;
    }
    this.speak(testText, () => {
      if (voiceURI) {
        this.settings.selectedVoiceURI = prevURI;
      }
    });
  }

  // Workaround for Chromium SpeechSynthesis pause bug on long utterances
  private startHeartbeat() {
    this.clearHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.status === 'speaking' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }
    }, 4000);
  }

  private clearHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  public getStatus(): SpeechStatus {
    return this.status;
  }

  public getCurrentText(): string {
    return this.currentText;
  }

  public getSettings(): VoiceSettings {
    return { ...this.settings };
  }

  public updateSettings(partial: Partial<VoiceSettings>) {
    this.settings = { ...this.settings, ...partial };
    this.saveSettings();
    this.notifyListeners();
  }

  public toggleVoice(): boolean {
    this.settings.voiceEnabled = !this.settings.voiceEnabled;
    this.saveSettings();
    if (!this.settings.voiceEnabled) {
      this.stop();
    }
    this.notifyListeners();
    return this.settings.voiceEnabled;
  }

  public subscribe(listener: SpeechStatusListener): () => void {
    this.listeners.add(listener);
    listener(this.status, this.currentText);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(fn => fn(this.status, this.currentText));
  }
}

export const speechService = new SpeechService();
