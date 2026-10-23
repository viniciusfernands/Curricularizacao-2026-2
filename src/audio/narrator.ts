import type { SpeechPart } from './instructions';

export type NarrationState = 'idle' | 'loading' | 'speaking' | 'blocked' | 'unavailable' | 'error';

export function portugueseVoice<T extends { lang: string; default: boolean; localService: boolean }>(voices: readonly T[]): T | undefined {
  const language = (voice: T) => voice.lang.toLowerCase().replaceAll('_', '-');
  const score = (voice: T) => (language(voice) === 'pt-br' ? 100 : 0) + Number(voice.default) * 10 + Number(voice.localService);
  return voices.filter(v => /^pt(?:-|$)/.test(language(v))).sort((a, b) => score(b) - score(a))[0];
}

/** Uma execução por vez; callbacks de falas canceladas não podem iniciar novos trechos. */
export class Narrator {
  private generation = 0;
  private timers = new Set<ReturnType<typeof setTimeout>>();
  private removeVoiceListener?: () => void;
  private current?: SpeechSynthesisUtterance;
  private synthesis: SpeechSynthesis | undefined;
  private createUtterance: (text: string) => SpeechSynthesisUtterance;

  constructor(
    synthesis = typeof window !== 'undefined' ? window.speechSynthesis : undefined,
    createUtterance = (text: string) => new SpeechSynthesisUtterance(text),
  ) {
    this.synthesis = synthesis;
    this.createUtterance = createUtterance;
  }

  stop() {
    const hadUtterance = !!this.current;
    this.generation++;
    for (const timer of this.timers) clearTimeout(timer);
    this.timers.clear();
    this.removeVoiceListener?.();
    this.removeVoiceListener = undefined;
    if (this.current) {
      this.current.onend = this.current.onerror = this.current.onstart = null;
      this.current = undefined;
    }
    if (hadUtterance) this.synthesis?.cancel();
  }

  private later(callback: () => void, delay: number) {
    const timer = setTimeout(() => { this.timers.delete(timer); callback(); }, delay);
    this.timers.add(timer);
    return timer;
  }

  speak(parts: readonly SpeechPart[], onState: (state: NarrationState) => void) {
    this.stop();
    const generation = this.generation;
    const synthesis = this.synthesis;
    if (!synthesis) { onState('unavailable'); return; }
    if (!parts.length) { onState('idle'); return; }
    onState('loading');
    const fail = (state: NarrationState) => {
      if (generation !== this.generation) return;
      this.stop();
      onState(state);
    };
    const play = (index: number, voice: SpeechSynthesisVoice) => {
      if (generation !== this.generation) return;
      if (index >= parts.length) { this.current = undefined; onState('idle'); return; }
      const part = parts[index];
      const utterance = this.createUtterance(part.text);
      this.current = utterance; // Mantém a referência até o navegador concluir a fala.
      utterance.voice = voice;
      utterance.lang = voice.lang;
      utterance.rate = part.rate ?? 0.88;
      utterance.pitch = 1;
      utterance.volume = 1;
      const clear = (timer: ReturnType<typeof setTimeout>) => { clearTimeout(timer); this.timers.delete(timer); };
      const startTimeout = this.later(() => fail('blocked'), 5000);
      let endTimeout: ReturnType<typeof setTimeout> | undefined;
      utterance.onstart = () => {
        if (generation !== this.generation) return;
        clear(startTimeout);
        onState('speaking');
        endTimeout = this.later(() => fail('error'), Math.max(15000, part.text.length * 250));
      };
      utterance.onend = () => {
        if (generation !== this.generation) return;
        clear(startTimeout);
        if (endTimeout) clear(endTimeout);
        this.later(() => play(index + 1, voice), part.pauseAfter ?? 300);
      };
      utterance.onerror = event => fail(event.error === 'not-allowed' ? 'blocked' : 'error');
      try { synthesis.speak(utterance); } catch { fail('error'); }
    };
    let started = false;
    const start = () => {
      if (started || generation !== this.generation) return;
      const voice = portugueseVoice(synthesis.getVoices());
      if (!voice) return;
      started = true;
      this.removeVoiceListener?.();
      this.removeVoiceListener = undefined;
      play(0, voice);
    };
    synthesis.addEventListener('voiceschanged', start);
    this.removeVoiceListener = () => synthesis.removeEventListener('voiceschanged', start);
    start();
    if (!started) this.later(() => {
      start();
      if (!started) fail('unavailable');
    }, 1500);
  }
}
