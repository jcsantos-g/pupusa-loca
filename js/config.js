// ¡Volteala! — Constantes del juego, reglas de dificultad, utilidades y estado compartido.

const INK = '#26203f';
const DISPLAY = '"Lilita One", "Arial Rounded MT Bold", "Trebuchet MS", sans-serif';
const LIVES = 3;
// escala de cocción de un lado: 0 crudo, 1 en su punto pasado, 1.25 quemado
const Z_GOOD = 0.55, Z_PERF = 0.75, Z_PERF_END = 0.92, Z_DONE = 1.0, Z_BURN = 1.25;
const RING = [[0, Z_GOOD, '#e6dccb'], [Z_GOOD, Z_PERF, '#a6e59a'], [Z_PERF, Z_PERF_END, '#22b04a'], [Z_PERF_END, Z_DONE, '#a6e59a'], [Z_DONE, Z_BURN, '#ff5a5f']];
const FILLINGS = [['#fff2a8', '#6b2f15'], ['#fff2a8', '#a8431f'], ['#fff2a8', '#4fae3f'], ['#fff2a8', '#fff2a8']];

const $ = (id) => document.getElementById(id);
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = (n) => n.toLocaleString('es-SV');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
};

const cv = $('game');
const ctx = cv.getContext('2d');
const stage = $('stage');

let W = 400, H = 600, S = 1, DPR = 1, CX = 200, CY = 300, R = 180, PR = 50, OFF = 70;
let floorLayer = null, comalLayer = null;
let state = 'menu';
let run = null, pupusas = [null, null, null, null];
let parts = [], texts = [], smoke = [], shakeT = 0, flashT = 0, endT = 0, heat = 0;
// récord con la escala nueva de puntos (la anterior daba miles)
let best = parseInt(store.get('volteala.best2', '0'), 10) || 0;

// ---------- reglas ----------
// dificultad por nivel: niveles 1 a 3 abren puestos; del 4 en adelante sube el fuego
const cookFor = (lv) => Math.max(1.2, [2.6, 2.5, 2.4, 2.2][lv - 1] ?? 2.2 * Math.pow(0.93, lv - 4));
const gapFor = (lv) => Math.max(0.35, 1.25 - lv * 0.08);
const ACTIVE = (lv) => (lv >= 3 ? [0, 1, 2, 3] : lv === 2 ? [0, 3, 1] : [0, 3]);
const PER_LEVEL = 6;    // pupusas servidas para subir de nivel
const GREEN_RATE = 0.55;
const CRUDA = 5;        // puntos que se pierden por voltear o servir cruda
const FEVER = 6;     // segundos de "comal en llamas"
const FEVER_AT = 8;  // perfectas seguidas para encenderlo
