'use client';

class AmbientEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private activeVoices: { osc: OscillatorNode; gain: GainNode }[] = [];
  private isPlaying: boolean = false;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public play() {
    try {
      this.init();
      if (!this.ctx) return;

      // Always resume context on user action
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.stopImmediate();

      const now = this.ctx.currentTime;

      // Master Gain with smooth fade in
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.20, now + 1.2); // Clearly audible volume (20%)

      // Warm Lowpass Filter with gentle resonance
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(680, now);
      filter.Q.setValueAtTime(1.5, now);

      this.masterGain.connect(filter);
      filter.connect(this.ctx.destination);

      // Analog Tape Warble LFO (Slow pitch modulation for authentic retro Lo-Fi vibe)
      this.lfo = this.ctx.createOscillator();
      this.lfoGain = this.ctx.createGain();
      this.lfo.frequency.setValueAtTime(0.35, now); // 0.35Hz slow wobble
      this.lfoGain.gain.setValueAtTime(4.5, now);    // Subtle 4.5 cents detune wobble
      this.lfo.connect(this.lfoGain);
      this.lfo.start();

      // Cyberpunk Ambient Lo-Fi Chord Progression: D minor 9th (D3, F3, A3, C4, E4, A4)
      const chordFrequencies = [146.83, 174.61, 220.00, 261.63, 329.63, 440.00];

      chordFrequencies.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain || !this.lfoGain) return;

        const osc = this.ctx.createOscillator();
        const voiceGain = this.ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        // Individual chorus spread
        const spread = (idx - 2.5) * 3.2;
        osc.detune.setValueAtTime(spread, now);

        // Connect LFO wobble to frequency
        this.lfoGain.connect(osc.detune);

        // Relative voice volume
        const gainLevel = idx === 0 ? 0.35 : 0.18;
        voiceGain.gain.setValueAtTime(gainLevel, now);

        osc.connect(voiceGain);
        voiceGain.connect(this.masterGain);

        osc.start(now);
        this.activeVoices.push({ osc, gain: voiceGain });
      });

      this.isPlaying = true;
    } catch (err) {
      console.warn('Ambient Audio error:', err);
      this.isPlaying = false;
    }
  }

  private stopImmediate() {
    this.activeVoices.forEach(({ osc, gain }) => {
      try {
        osc.stop();
        osc.disconnect();
        gain.disconnect();
      } catch {}
    });
    this.activeVoices = [];

    if (this.lfo) {
      try {
        this.lfo.stop();
        this.lfo.disconnect();
      } catch {}
      this.lfo = null;
    }
    if (this.lfoGain) {
      try { this.lfoGain.disconnect(); } catch {}
      this.lfoGain = null;
    }
    if (this.masterGain) {
      try { this.masterGain.disconnect(); } catch {}
      this.masterGain = null;
    }
  }

  public stop() {
    try {
      if (this.masterGain && this.ctx) {
        const now = this.ctx.currentTime;
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      }
      setTimeout(() => {
        this.stopImmediate();
        this.isPlaying = false;
      }, 700);
    } catch {
      this.stopImmediate();
      this.isPlaying = false;
    }
  }
}

export const ambientSound = new AmbientEngine();
