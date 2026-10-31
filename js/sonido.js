// ¡Volteala! — Sonidos generados con Web Audio (no usa archivos de audio).

// ---------- sonido ----------
let actx = null, noiseBuf = null, sizzle = null;
let soundOn = store.get('volteala.sound', 'on') !== 'off';
function initAudio() {
  if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { actx = null; } }
  if (actx && actx.state === 'suspended') actx.resume().catch(() => {});
}
function tone(f, dur, type, vol, slide, delay = 0) {
  if (!actx || !soundOn) return;
  const t0 = actx.currentTime + delay;
  const o = actx.createOscillator(), g = actx.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(slide, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(actx.destination);
  o.start(t0); o.stop(t0 + dur + 0.05);
}
function getNoise() {
  if (!noiseBuf) {
    noiseBuf = actx.createBuffer(1, actx.sampleRate * 2, actx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  return noiseBuf;
}
function noise(dur, vol, freq) {
  if (!actx || !soundOn) return;
  const s = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain();
  const t0 = actx.currentTime;
  s.buffer = getNoise(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 0.8;
  g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  s.connect(f); f.connect(g); g.connect(actx.destination);
  s.start(t0); s.stop(t0 + dur);
}
function sizzleOn() {
  if (!actx || !soundOn || sizzle) return;
  const s = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain();
  s.buffer = getNoise(); s.loop = true;
  f.type = 'highpass'; f.frequency.value = 4500; g.gain.value = 0.014;
  s.connect(f); f.connect(g); g.connect(actx.destination);
  s.start();
  sizzle = s;
}
function sizzleOff() { if (sizzle) { try { sizzle.stop(); } catch (e) {} sizzle = null; } }
const snd = {
  flip() { noise(0.12, 0.12, 1800); tone(380, 0.08, 'triangle', 0.06, 620); },
  perfect(k) { const f = 660 * Math.pow(1.06, Math.min(k, 12)); tone(f, 0.12, 'triangle', 0.13, f * 1.5); tone(f * 1.5, 0.1, 'sine', 0.06, null, 0.05); },
  good() { tone(520, 0.1, 'triangle', 0.1, 700); },
  raw() { tone(240, 0.16, 'square', 0.05, 180); },
  serve() { [523, 659, 784].forEach((f, i) => tone(f, 0.12, 'triangle', 0.1, null, i * 0.06)); },
  burn() { noise(0.5, 0.22, 900); tone(200, 0.4, 'sawtooth', 0.06, 60); },
  fire() { noise(0.35, 0.15, 400); },
  levelUp() { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.16, 'triangle', 0.11, null, i * 0.07)); noise(0.4, 0.12, 700); },
  ready(slot) { const f = [880, 988, 1109, 1175][slot]; tone(f, 0.14, 'sine', 0.12); tone(f * 2, 0.08, 'sine', 0.04, null, 0.02); },
  alarm(k) { tone(1100 + k * 500, 0.06, 'square', 0.035 + k * 0.03); },
  gold() { [988, 1319].forEach((f, i) => tone(f, 0.1, 'sine', 0.08, null, i * 0.06)); },
  fever() { noise(0.6, 0.25, 500); [392, 523, 659, 784, 1047].forEach((f, i) => tone(f, 0.12, 'square', 0.06, null, i * 0.05)); },
  tick(i, fev) {
    if (i % 2 === 0) tone(130, 0.14, 'sine', fev ? 0.16 : 0.11, 45);
    else noise(0.04, fev ? 0.07 : 0.04, 8000);
    if (fev && i % 2 === 0) tone([110, 110, 147, 131][(i / 2) % 4], 0.12, 'square', 0.03);
  },
  end() { [784, 659, 523, 392].forEach((f, i) => tone(f, 0.18, 'triangle', 0.1, null, i * 0.12)); },
};
