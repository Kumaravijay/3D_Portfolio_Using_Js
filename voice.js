// Voice engine: plays greeting.mp3 (with live amplitude analysis that drives
// the stage visuals) or falls back to the browser's built-in male voice.

export class VoiceEngine {
  constructor() {
    this.speaking = false;
    this.audioCtx = null;
    this.analyser = null;
    this.freqData = null;
    this.duration = 0;
    this.mode = null;
    this._amp = 0;
    this.onEnd = null;
  }

  async playAudio(url) {
    this.stop();
    const Ctx = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = this.audioCtx || new Ctx();
    if (this.audioCtx.state === "suspended") await this.audioCtx.resume();

    const res = await fetch(url);
    if (!res.ok) throw new Error("no audio");
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    if (!ct.includes("audio")) throw new Error("not audio");
    const buf = await this.audioCtx.decodeAudioData(await res.arrayBuffer());

    const src = this.audioCtx.createBufferSource();
    src.buffer = buf;
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 512;
    this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
    src.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);

    this.duration = buf.duration;
    this.mode = "audio";
    this.speaking = true;
    this._source = src;
    src.onended = () => { this.speaking = false; this.onEnd && this.onEnd(); };
    src.start();
  }

  speakBrowser(text, prefs) {
    this.stop();
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    for (const name of prefs.preferredNames) {
      const v = voices.find((v) => v.name.includes(name) || v.lang.includes(name));
      if (v) { u.voice = v; break; }
    }
    u.rate = prefs.rate;
    u.pitch = prefs.pitch;
    this.duration = text.split(/\s+/).length / (2.6 * prefs.rate);
    this.mode = "browser";
    this.speaking = true;
    u.onend = () => { this.speaking = false; this.onEnd && this.onEnd(); };
    synth.speak(u);
  }

  stop() {
    if (this._source) { try { this._source.stop(); } catch {} this._source = null; }
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    this.speaking = false;
  }

  // 0..1 how loud the voice is right now (smoothed)
  amplitude() {
    if (!this.speaking) { this._amp *= 0.9; return this._amp; }
    if (this.mode === "audio" && this.analyser) {
      this.analyser.getByteFrequencyData(this.freqData);
      let sum = 0; const n = 40;
      for (let i = 2; i < n; i++) sum += this.freqData[i];
      const amp = Math.min(1, (sum / n / 255) * 2.2);
      this._amp += (amp - this._amp) * 0.3;
    } else {
      // browser voice exposes no audio data → gentle organic pulse
      const t = performance.now() / 1000;
      this._amp = 0.45 + 0.3 * Math.abs(Math.sin(t * 6.3) * Math.sin(t * 2.1));
    }
    return this._amp;
  }
}
