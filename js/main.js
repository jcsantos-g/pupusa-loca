// ¡Volteala! — Pantallas, marcador, controles (mouse, toque, teclado) y ciclo principal del juego.

// ---------- pantallas ----------
const overlay = $('overlay');
const panels = ['ovMenu', 'ovPause', 'ovOver'];
function showOverlay(id) {
  overlay.hidden = !id;
  overlay.classList.toggle('menu', id === 'ovMenu');
  for (const k of panels) $(k).hidden = k !== id;
  if (id) { const b = $(id).querySelector('.btn'); if (b) b.focus({ preventScroll: true }); }
}

function refreshMenu() {
  $('bestTxt').textContent = fmt(best);
  setPill();
}

function start() {
  initAudio();
  run = newRun();
  pupusas = [null, null, null, null];
  parts = []; texts = []; smoke = []; heat = 0;
  state = 'play';
  setPill();
  showOverlay(null);
  sizzleOn();
}

function pause() {
  if (state !== 'play') return;
  state = 'pause';
  sizzleOff();
  showOverlay('ovPause');
}
function resume() {
  if (state !== 'pause') return;
  initAudio();
  state = 'play';
  showOverlay(null);
  sizzleOn();
}
function toMenu() {
  state = 'menu';
  sizzleOff();
  pupusas = [null, null, null, null];
  refreshMenu();
  showOverlay('ovMenu');
}

// las pasaditas (tarde pero sin quemarse) cuentan como buenas
function counts(r) {
  const n = (g) => r.log.filter((x) => x === g).length;
  return { ok: n('B') + n('X'), raw: n('C'), burnt: n('Q') };
}

function endGame() {
  state = 'over';
  sizzleOff();
  snd.end();
  const r = run;
  const isNew = r.score > best;
  if (isNew) { best = r.score; store.set('volteala.best2', String(best)); }
  $('newBest').hidden = !isNew;
  $('finalScore').textContent = fmt(r.score);
  $('stPerf').textContent = r.perf;
  $('stStreak').textContent = r.bestStreak;
  $('stLevel').textContent = r.level;
  const c = counts(r);
  $('stOk').textContent = c.ok;
  $('stRaw').textContent = c.raw;
  $('stBurnt').textContent = c.burnt;
  showOverlay('ovOver');
  refreshMenu();
}

// ---------- marcador ----------
const shown = {};
function setText(id, v) { if (shown[id] !== v) { shown[id] = v; $(id).textContent = v; } }
function streakBump() {
  const c = $('streakChip');
  c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
}
function updateHud() {
  const r = run;
  setText('score', fmt(r ? r.score : 0));
  setText('streak', String(r ? r.streak : 0));
  $('streakChip').classList.toggle('hot', !!r && r.streak >= 5 && state === 'play');
  const lives = r && state !== 'menu' ? r.lives : LIVES;
  if (shown.lives !== lives) {
    shown.lives = lives;
    $('lives').innerHTML = Array.from({ length: LIVES }, (_, i) => `<span class="life${i < lives ? '' : ' off'}"></span>`).join('');
    $('lives').setAttribute('aria-label', `${lives} ${lives === 1 ? 'vida' : 'vidas'}`);
  }
}

const soundBtn = $('soundBtn');
function paintSound() {
  soundBtn.innerHTML = soundOn
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16.5 9.5l5 5M21.5 9.5l-5 5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
  soundBtn.setAttribute('aria-pressed', String(soundOn));
  soundBtn.setAttribute('aria-label', soundOn ? 'Quitar sonido' : 'Poner sonido');
}

// ---------- controles ----------
cv.addEventListener('pointerdown', (e) => {
  initAudio();
  if (state !== 'play') return;
  const b = cv.getBoundingClientRect();
  const { x, y } = toWorld(e.clientX - b.left, e.clientY - b.top);
  let hit = null, bestD = PR * 1.35;
  for (const p of pupusas) {
    if (!p || p.st !== 'cook') continue;
    const { x: px, y: py } = slotPos(p.slot);
    const d = Math.hypot(x - px, y - py);
    if (d < bestD) { bestD = d; hit = p; }
  }
  if (hit) tap(hit);
});
window.addEventListener('keydown', (e) => {
  const k = e.key;
  if (k >= '1' && k <= '4' && state === 'play') {
    const p = pupusas[+k - 1];
    if (p) tap(p);
    e.preventDefault();
  } else if (k === 'p' || k === 'P' || k === 'Escape') {
    state === 'play' ? pause() : resume();
  }
});

$('playBtn').addEventListener('click', start);
$('againBtn').addEventListener('click', start);
$('resumeBtn').addEventListener('click', resume);
$('quitBtn').addEventListener('click', toMenu);
$('menuBtn').addEventListener('click', toMenu);
$('pauseBtn').addEventListener('click', (e) => { state === 'play' ? pause() : resume(); e.currentTarget.blur(); });
soundBtn.addEventListener('click', () => {
  soundOn = !soundOn;
  store.set('volteala.sound', soundOn ? 'on' : 'off');
  if (soundOn) { initAudio(); if (state === 'play') sizzleOn(); } else sizzleOff();
  paintSound();
  soundBtn.blur();
});
document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
window.addEventListener('blur', pause);

// ---------- tamaño y arranque ----------
function resize() {
  const b = stage.getBoundingClientRect();
  W = Math.max(200, b.width); H = Math.max(240, b.height);
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
  S = clamp(Math.min(W / 420, H / 640), 0.7, 1.35);
  const top = 40 * S;
  R = Math.max(80, Math.min(W / 2 - 14 * S, (H - top - 14 * S) / 2));
  CX = W / 2;
  CY = top + (H - top) / 2;
  PR = R * 0.29;
  OFF = R * 0.41;
  buildLayers();
}

new ResizeObserver(resize).observe(stage);
resize();
paintSound();
refreshMenu();
updateHud();
if (document.fonts && document.fonts.load) document.fonts.load('20px "Lilita One"').catch(() => {});

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  update(dt);
  render(now / 1000, dt);
  updateHud();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
showOverlay('ovMenu');
