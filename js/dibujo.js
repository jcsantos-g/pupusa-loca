// ¡Volteala! — Todo lo que se dibuja en el canvas: comal, pupusas, anillo, caras, efectos y cámara.

// ---------- efectos ----------
function burst(x, y, colors, n, spd) {
  for (let i = 0; i < n; i++) {
    const life = rand(0.45, 0.9);
    parts.push({ x, y, vx: rand(-1, 1) * spd * S, vy: rand(-1.3, -0.2) * spd * S, life, max: life, size: rand(2.5, 5.5) * S, color: colors[i % colors.length] });
  }
}
function say(text, x, y, opt = {}) {
  const life = opt.life ?? 1;
  texts.push({ text, x, y, vy: (opt.vy ?? -45) * S, life, max: life, size: (opt.size ?? 20) * S, color: opt.color ?? '#fffaf0' });
}
function shake(s) { if (!reduceMotion) shakeT = Math.max(shakeT, s); }
function updateFx(dt) {
  for (const arr of [parts, texts, smoke]) {
    for (let i = arr.length - 1; i >= 0; i--) {
      const q = arr[i];
      q.life -= dt;
      if (q.life <= 0) { arr.splice(i, 1); continue; }
      if (arr === parts) { q.vy += 560 * S * dt; q.x += q.vx * dt; q.y += q.vy * dt; }
      else if (arr === texts) q.y += q.vy * dt;
      else { q.y -= 34 * S * dt; q.r += 10 * S * dt; q.x += Math.sin(q.life * 5) * 8 * S * dt; }
    }
  }
}

// ---------- dibujo ----------
function ell(c, x, y, rx, ry) { c.beginPath(); c.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, Math.PI * 2); }
function slotPos(i) { return { x: CX + (i % 2 ? 1 : -1) * OFF, y: CY + (i > 1 ? 1 : -1) * OFF }; }
const ang = (d) => -Math.PI / 2 + (Math.min(d, Z_BURN) / Z_BURN) * Math.PI * 2;

const COOK_STOPS = [[0, [244, 230, 200]], [0.55, [240, 214, 156]], [0.83, [234, 171, 74]], [1.0, [184, 116, 47]], [1.25, [42, 29, 22]]];
function cookColor(d) {
  d = clamp(d, 0, 1.25);
  for (let i = 1; i < COOK_STOPS.length; i++) {
    const [b, cb] = COOK_STOPS[i];
    if (d <= b) {
      const [a, ca] = COOK_STOPS[i - 1];
      const k = (d - a) / (b - a);
      return `rgb(${ca.map((v, j) => Math.round(v + (cb[j] - v) * k)).join(',')})`;
    }
  }
  return 'rgb(42,29,22)';
}

function buildLayers() {
  floorLayer = document.createElement('canvas');
  floorLayer.width = cv.width; floorLayer.height = cv.height;
  let c = floorLayer.getContext('2d');
  c.setTransform(DPR, 0, 0, DPR, 0, 0);
  c.fillStyle = '#b94c33'; c.fillRect(0, 0, W, H);
  const ts = 46 * S;
  for (let y = 0, row = 0; y < H; y += ts, row++) {
    for (let x = (row % 2) * -ts / 2; x < W; x += ts) {
      c.fillStyle = (Math.floor(x / ts) + row) % 2 ? '#c4553a' : '#bd5036';
      c.fillRect(x + 1.5 * S, y + 1.5 * S, ts - 3 * S, ts - 3 * S);
    }
  }
  // papel picado
  const colors = ['#ff5fa2', '#ffd23f', '#3fbf6a', '#3f8cff', '#9b5de5', '#ff7a1a'];
  const lineY = (x) => 8 * S + Math.sin((x / W) * Math.PI) * 10 * S;
  c.strokeStyle = INK; c.lineWidth = 1.5 * S;
  c.beginPath();
  for (let x = 0; x <= W; x += 8) x ? c.lineTo(x, lineY(x)) : c.moveTo(x, lineY(x));
  c.stroke();
  const fw = 26 * S, fh = 28 * S, step = 34 * S;
  for (let i = 0, x = 6 * S; x < W; i++, x += step) {
    const y = lineY(x + fw / 2);
    c.fillStyle = colors[i % colors.length];
    c.beginPath();
    c.moveTo(x, y); c.lineTo(x + fw, y); c.lineTo(x + fw, y + fh);
    for (let k = 4; k >= 0; k--) c.lineTo(x + (fw * k) / 4, y + fh - (k % 2 ? 5 * S : 0));
    c.closePath(); c.fill();
    c.fillStyle = 'rgba(255,255,255,.55)';
    for (const [dx, dy] of [[0.5, 0.35], [0.25, 0.62], [0.75, 0.62]]) {
      const cx = x + fw * dx, cy = y + fh * dy, d = 3 * S;
      c.beginPath(); c.moveTo(cx, cy - d); c.lineTo(cx + d, cy); c.lineTo(cx, cy + d); c.lineTo(cx - d, cy); c.closePath(); c.fill();
    }
  }

  comalLayer = document.createElement('canvas');
  comalLayer.width = cv.width; comalLayer.height = cv.height;
  c = comalLayer.getContext('2d');
  c.setTransform(DPR, 0, 0, DPR, 0, 0);
  c.beginPath(); c.arc(CX + 5 * S, CY + 7 * S, R, 0, Math.PI * 2); c.fillStyle = 'rgba(30,10,5,.45)'; c.fill();
  const g = c.createRadialGradient(CX - R * 0.3, CY - R * 0.35, R * 0.1, CX, CY, R);
  g.addColorStop(0, '#5a5962'); g.addColorStop(0.6, '#38373e'); g.addColorStop(1, '#25242a');
  c.beginPath(); c.arc(CX, CY, R, 0, Math.PI * 2); c.fillStyle = g; c.fill();
  c.lineWidth = 4 * S; c.strokeStyle = INK; c.stroke();
  c.strokeStyle = 'rgba(255,255,255,.05)'; c.lineWidth = 2 * S;
  for (let k = 0.25; k < 1; k += 0.18) { c.beginPath(); c.arc(CX, CY, R * k, 0, Math.PI * 2); c.stroke(); }
  // marca de cada puesto
  for (let i = 0; i < 4; i++) {
    const { x, y } = slotPos(i);
    c.beginPath(); c.arc(x, y, PR * 1.02, 0, Math.PI * 2);
    c.fillStyle = 'rgba(0,0,0,.18)'; c.fill();
    c.fillStyle = 'rgba(255,255,255,.18)';
    c.font = `${PR * 0.5}px ${DISPLAY}`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(String(i + 1), x, y);
  }
}

function drawFire(t) {
  const fev = run && run.fever > 0 && state !== 'menu' ? 1 : 0;
  const glow = 0.35 + heat * 0.4 + fev * 0.35 + Math.sin(t * 7) * 0.05;
  const g = ctx.createRadialGradient(CX, CY, R * 0.9, CX, CY, R * 1.25);
  g.addColorStop(0, `rgba(255,140,30,${glow})`); g.addColorStop(1, 'rgba(255,140,30,0)');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(CX, CY, R * 1.25, 0, Math.PI * 2); ctx.fill();
  const n = 22;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + 0.1;
    const len = (8 + heat * 10 + fev * 22 + Math.sin(t * (9 + fev * 8) + i * 1.9) * (4 + fev * 6)) * S;
    const bx = CX + Math.cos(a) * R * 0.96, by = CY + Math.sin(a) * R * 0.96;
    const tx = CX + Math.cos(a) * (R + len), ty = CY + Math.sin(a) * (R + len);
    const px = -Math.sin(a) * 8 * S, py = Math.cos(a) * 8 * S;
    ctx.fillStyle = i % 2 ? '#ff7a1a' : '#ffb020';
    ctx.beginPath(); ctx.moveTo(bx - px, by - py); ctx.quadraticCurveTo(tx, ty, bx + px, by + py); ctx.closePath(); ctx.fill();
  }
}

function drawRing(x, y, d) {
  const r = PR * 1.2, w = Math.max(6 * S, PR * 0.15);
  ctx.lineCap = 'butt';
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.lineWidth = w + 5 * S; ctx.strokeStyle = INK; ctx.stroke();
  for (const [a, b, col] of RING) {
    ctx.beginPath(); ctx.arc(x, y, r, ang(a), ang(b));
    ctx.lineWidth = w; ctx.strokeStyle = col; ctx.globalAlpha = 0.4; ctx.stroke();
    if (d > a) {
      ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(x, y, r, ang(a), ang(Math.min(b, d))); ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
  const ka = ang(d);
  ctx.beginPath(); ctx.arc(x + Math.cos(ka) * r, y + Math.sin(ka) * r, w * 0.85, 0, Math.PI * 2);
  ctx.fillStyle = '#fffaf0'; ctx.fill(); ctx.lineWidth = 2.5 * S; ctx.strokeStyle = INK; ctx.stroke();
}

function drawFace(x, y, r, d, burnt, t) {
  const e = r * 0.11, ex = r * 0.3, ey = y - r * 0.08, my = y + r * 0.28;
  const perfect = d >= Z_PERF && d <= Z_PERF_END;
  ctx.lineWidth = 2.5 * S; ctx.strokeStyle = INK; ctx.lineCap = 'round';
  if (perfect) {
    ctx.fillStyle = 'rgba(255,90,120,.45)';
    ell(ctx, x - ex - e * 0.4, ey + e * 1.6, e * 0.9, e * 0.5); ctx.fill();
    ell(ctx, x + ex + e * 0.4, ey + e * 1.6, e * 0.9, e * 0.5); ctx.fill();
  }
  for (const side of [-1, 1]) {
    const cx = x + side * ex;
    ctx.beginPath();
    if (burnt) {
      ctx.moveTo(cx - e * 0.7, ey - e * 0.7); ctx.lineTo(cx + e * 0.7, ey + e * 0.7);
      ctx.moveTo(cx + e * 0.7, ey - e * 0.7); ctx.lineTo(cx - e * 0.7, ey + e * 0.7);
      ctx.strokeStyle = '#fffaf0'; ctx.stroke(); ctx.strokeStyle = INK;
    } else if (d < Z_GOOD) {
      ctx.moveTo(cx - e * 0.8, ey); ctx.quadraticCurveTo(cx, ey + e * 0.6, cx + e * 0.8, ey); ctx.stroke();
    } else if (perfect) {
      ctx.arc(cx, ey + e * 0.4, e * 0.85, Math.PI * 1.12, Math.PI * 1.88); ctx.stroke();
    } else if (d > Z_DONE) {
      // ojos apretados ">  <" y lágrimas que caen
      ctx.moveTo(cx + side * e * 0.75, ey - e * 0.6); ctx.lineTo(cx - side * e * 0.45, ey); ctx.lineTo(cx + side * e * 0.75, ey + e * 0.6);
      ctx.stroke();
      const len = r * 0.55;
      ctx.fillStyle = '#5fc4ff';
      for (let k = 0; k < 3; k++) {
        const f = ((t * 2.2 + k / 3 + (side > 0 ? 0.15 : 0)) % 1);
        ell(ctx, cx + side * e * 0.2, ey + e * 0.8 + f * len, e * 0.32 * (1 - f * 0.3), e * 0.45 * (1 - f * 0.3));
        ctx.fill();
      }
      ctx.beginPath(); ctx.moveTo(cx + side * e * 0.2, ey + e * 0.7); ctx.lineTo(cx + side * e * 0.2, ey + e * 0.7 + len * 0.7);
      ctx.lineWidth = e * 0.35; ctx.strokeStyle = 'rgba(95,196,255,.7)'; ctx.stroke();
      ctx.lineWidth = 2.5 * S; ctx.strokeStyle = INK;
    } else {
      ctx.arc(cx, ey, e, 0, Math.PI * 2);
      ctx.fillStyle = '#fff'; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, ey, e * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = INK; ctx.fill();
    }
  }
  ctx.beginPath();
  if (burnt) {
    ctx.moveTo(x - e, my); ctx.lineTo(x + e, my); ctx.strokeStyle = '#fffaf0'; ctx.stroke(); ctx.strokeStyle = INK;
  } else if (d > Z_DONE) {
    // llanto a boca abierta
    const w = 1 + Math.sin(t * 16) * 0.12;
    ctx.beginPath();
    ctx.moveTo(x - e * 1.1, my - e * 0.2);
    ctx.quadraticCurveTo(x, my - e * 0.9 * w, x + e * 1.1, my - e * 0.2);
    ctx.quadraticCurveTo(x, my + e * 1.4 * w, x - e * 1.1, my - e * 0.2);
    ctx.closePath();
    ctx.fillStyle = '#7a2230'; ctx.fill(); ctx.stroke();
  } else if (perfect) {
    ctx.arc(x, my - e * 0.5, e * 1.2, Math.PI * 0.1, Math.PI * 0.9); ctx.closePath();
    ctx.fillStyle = '#7a2230'; ctx.fill(); ctx.stroke();
  } else if (d < Z_GOOD) {
    ctx.arc(x, my, e * 0.35, 0, Math.PI * 2); ctx.stroke();
  } else {
    ctx.arc(x, my - e * 0.6, e * 0.85, Math.PI * 0.18, Math.PI * 0.82); ctx.stroke();
  }
}

function drawBubble(x, y, text, fill, t) {
  const size = 18 * S * (reduceMotion ? 1 : 1 + Math.sin(t * 14) * 0.06);
  ctx.font = `${size}px ${DISPLAY}`;
  const w = ctx.measureText(text).width + 18 * S, h = size * 1.5;
  const bx = clamp(x, w / 2 + 4, W - w / 2 - 4);
  ctx.beginPath();
  const r = h / 2, l = bx - w / 2, tp = y - h / 2;
  ctx.moveTo(l + r, tp); ctx.arcTo(l + w, tp, l + w, tp + h, r); ctx.arcTo(l + w, tp + h, l, tp + h, r);
  ctx.arcTo(l, tp + h, l, tp, r); ctx.arcTo(l, tp, l + w, tp, r); ctx.closePath();
  ctx.fillStyle = fill; ctx.fill();
  ctx.lineWidth = 2.5 * S; ctx.strokeStyle = INK; ctx.stroke();
  ctx.fillStyle = '#fffaf0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, bx, y + 1);
}

function drawPupusa(p, t) {
  const pos = slotPos(p.slot);
  let x = pos.x, y = pos.y, sx = 1, sy = 1, alpha = 1, dv = p.d, side = p.side;
  const pop = Math.min(1, p.age / 0.22);
  let s = p.st === 'cook' && p.side === 0 ? 1 - Math.pow(1 - pop, 3) * 1 + Math.sin(pop * Math.PI) * 0.12 : 1;
  if (p.st === 'flip') {
    const f = p.at / 0.28;
    sy = Math.max(0.04, Math.abs(Math.cos(f * Math.PI)));
    y -= Math.sin(f * Math.PI) * PR * 0.6;
    dv = f < 0.5 ? p.dShow : 0;
    if (f >= 0.5) side = 1;
  } else if (p.st === 'out') {
    const k = p.at / 0.45;
    y -= k * PR * 1.6; alpha = 1 - k; s = 1 + k * 0.2; dv = p.dShow;
  } else if (p.st === 'burn') {
    dv = Z_BURN;
    if (!reduceMotion) x += Math.sin(p.at * 60) * 3 * S;
    alpha = p.at > 0.4 ? 1 - (p.at - 0.4) / 0.3 : 1;
  }
  const perfect = p.st === 'cook' && dv >= Z_PERF && dv <= Z_PERF_END;
  const danger = p.st === 'cook' && dv > Z_DONE ? (dv - Z_DONE) / (Z_BURN - Z_DONE) : 0;
  if (perfect && !reduceMotion) s *= 1 + Math.sin(t * 18) * 0.025;
  if (p.kick > 0) s *= 1 + p.kick * 0.2;
  if (danger && !reduceMotion) { x += Math.sin(t * 45) * (1.5 + danger * 3) * S; s *= 1 + Math.sin(t * 20) * 0.03; }
  if (danger) {
    ctx.beginPath(); ctx.arc(x, y, PR * (1.5 + Math.sin(t * 14) * 0.06), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(229,56,59,${0.3 + danger * 0.3 + Math.sin(t * 14) * 0.1})`; ctx.fill();
  }

  if (p.gold && (p.st === 'cook' || p.st === 'flip')) {
    for (let i = 0; i < 6; i++) {
      const a = t * 2.2 + (i / 6) * Math.PI * 2;
      const sx2 = x + Math.cos(a) * PR * 1.5, sy2 = y + Math.sin(a) * PR * 1.5, k = 5 * S * (1 + Math.sin(t * 9 + i) * 0.3);
      ctx.beginPath();
      ctx.moveTo(sx2, sy2 - k); ctx.lineTo(sx2 + k * 0.35, sy2 - k * 0.35); ctx.lineTo(sx2 + k, sy2);
      ctx.lineTo(sx2 + k * 0.35, sy2 + k * 0.35); ctx.lineTo(sx2, sy2 + k); ctx.lineTo(sx2 - k * 0.35, sy2 + k * 0.35);
      ctx.lineTo(sx2 - k, sy2); ctx.lineTo(sx2 - k * 0.35, sy2 - k * 0.35); ctx.closePath();
      ctx.fillStyle = '#ffd23f'; ctx.fill();
    }
  }

  if (p.st === 'cook') {
    if (perfect) {
      ctx.beginPath(); ctx.arc(x, y, PR * 1.48, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(34,176,74,${0.25 + Math.sin(t * 12) * 0.1})`; ctx.fill();
    }
    drawRing(x, y, p.d);
    const by = p.slot > 1 ? y + PR * 1.62 : y - PR * 1.62;
    // las dos primeras pupusas de cada partida enseñan a jugar; después avisan con globitos
    if (!p.tut && state !== 'menu') {
      if (perfect) drawBubble(x, by, '¡Ya!', '#22b04a', t);
      else if (danger) drawBubble(x, by, '¡Me quemo!', '#e5383b', t);
    }
    if (p.tut && state === 'play') {
      const d = p.d;
      const msg = d < Z_GOOD ? 'Esperá…' : d < Z_PERF ? 'Ya casi…' : d <= Z_PERF_END ? '¡Tocala!' : '¡Rápido!';
      const hot = d >= Z_PERF;
      const size = (hot ? 22 : 17) * S * (hot && !reduceMotion ? 1 + Math.sin(t * 14) * 0.06 : 1);
      ctx.font = `${size}px ${DISPLAY}`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
      const ty = p.slot > 1 ? y + PR * 1.62 : y - PR * 1.62;
      ctx.lineWidth = size * 0.24; ctx.strokeStyle = INK; ctx.strokeText(msg, x, ty);
      ctx.fillStyle = d <= Z_PERF_END && hot ? '#7dff8f' : d > Z_PERF_END ? '#ffb347' : '#fffaf0';
      ctx.fillText(msg, x, ty);
    }
  }

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.scale(s * sx, s * sy);
  const r = PR;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = cookColor(dv); ctx.fill();
  if (p.gold && dv < Z_DONE) {
    const sh = ctx.createLinearGradient(-r, -r, r, r);
    sh.addColorStop(0, 'rgba(255,230,90,.55)'); sh.addColorStop(0.5, 'rgba(255,255,255,.35)'); sh.addColorStop(1, 'rgba(255,200,40,.45)');
    ctx.fillStyle = sh; ctx.fill();
  }
  // relleno asomándose por la orilla
  for (let i = 0; i < 3; i++) {
    const a = 0.7 + i * 2.1;
    ell(ctx, Math.cos(a) * r * 0.86, Math.sin(a) * r * 0.86, r * 0.13, r * 0.09);
    ctx.fillStyle = p.fill[i % 2]; ctx.fill();
  }
  const spotA = clamp((dv - 0.3) * 0.8, 0, 0.6);
  ctx.fillStyle = `rgba(110,55,15,${spotA})`;
  for (const sp of p.spots) {
    ctx.beginPath(); ctx.arc(Math.cos(sp.a) * sp.r * r, Math.sin(sp.a) * sp.r * r, sp.s * r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.lineWidth = 3.5 * S; ctx.strokeStyle = INK; ctx.stroke();
  drawFace(0, 0, r, dv, p.st === 'burn', t);

  // insignia del lado
  const bx = r * 0.62, by = -r * 0.62, br = r * 0.2;
  ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2);
  ctx.fillStyle = side ? '#ffd23f' : '#fffaf0'; ctx.fill(); ctx.lineWidth = 2 * S; ctx.strokeStyle = INK; ctx.stroke();
  ctx.fillStyle = INK; ctx.font = `${br * 1.3}px ${DISPLAY}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(side ? '2' : '1', bx, by + 1);
  ctx.restore();
}

function drawFx() {
  for (const q of smoke) {
    ctx.globalAlpha = 0.35 * (q.life / q.max);
    ctx.fillStyle = q.dark ? '#3b3333' : '#ffffff';
    ctx.beginPath(); ctx.arc(q.x, q.y, q.r, 0, Math.PI * 2); ctx.fill();
  }
  for (const q of parts) {
    ctx.globalAlpha = Math.min(1, (q.life / q.max) * 1.6);
    ctx.fillStyle = q.color;
    ctx.beginPath(); ctx.arc(q.x, q.y, q.size, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  for (const q of texts) {
    const age = q.max - q.life;
    const size = q.size * (age < 0.15 ? 1 + ((0.15 - age) / 0.15) * 0.45 : 1);
    ctx.font = `${size}px ${DISPLAY}`;
    const w = ctx.measureText(q.text).width;
    const x = clamp(q.x, w / 2 + 6, W - w / 2 - 6);
    ctx.globalAlpha = Math.min(1, (q.life / q.max) * 2.5);
    ctx.lineWidth = size * 0.24; ctx.strokeStyle = INK; ctx.strokeText(q.text, x, q.y);
    ctx.fillStyle = q.color; ctx.fillText(q.text, x, q.y);
  }
  ctx.globalAlpha = 1;
}

// pupusa de muestra en el menú, cocinándose en bucle
const demo = { slot: 0, side: 0, d: 0, cook: 3, st: 'cook', age: 1, at: 0, res: [], dShow: 0, fill: FILLINGS[0],
  spots: Array.from({ length: 7 }, () => ({ a: rand(0, Math.PI * 2), r: Math.sqrt(Math.random()) * 0.75, s: rand(0.08, 0.16) })) };

// cámara: se acerca un poco a la pupusa que más se está quemando
const cam = { x: 0, y: 0, z: 1 };
function updateCam(dt) {
  let tx = CX, ty = CY, tz = 1, worst = null;
  if ((state === 'play' || state === 'ending') && !reduceMotion) {
    for (const p of pupusas) if (p && p.st === 'cook' && p.d >= Z_DONE && (!worst || p.d > worst.d)) worst = p;
  }
  if (worst) {
    const sp = slotPos(worst.slot);
    tz = 1.07; tx = CX + (sp.x - CX) * 0.35; ty = CY + (sp.y - CY) * 0.35;
  }
  if (!cam.x) { cam.x = CX; cam.y = CY; }
  const k = Math.min(1, dt * 6);
  cam.x += (tx - cam.x) * k; cam.y += (ty - cam.y) * k; cam.z += (tz - cam.z) * k;
}
// de pantalla a comal, para que el toque caiga donde se ve la pupusa
const toWorld = (sx, sy) => ({ x: cam.x + (sx - CX) / cam.z, y: cam.y + (sy - CY) / cam.z });

function render(t, dt) {
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.fillStyle = '#b94c33'; ctx.fillRect(0, 0, W, H);
  ctx.save();
  updateCam(dt);
  ctx.translate(CX, CY); ctx.scale(cam.z, cam.z); ctx.translate(-cam.x, -cam.y);
  if (shakeT > 0) { const m = shakeT * 16 * S; ctx.translate(rand(-m, m), rand(-m, m)); }
  if (floorLayer) ctx.drawImage(floorLayer, 0, 0, W, H);
  drawFire(t);
  if (comalLayer) ctx.drawImage(comalLayer, 0, 0, W, H);
  if (state === 'menu') {
    demo.d = (demo.d + dt / demo.cook) % 1.2;
    for (let i = 0; i < 4; i++) drawPupusa({ ...demo, slot: i, d: (demo.d + i * 0.3) % 1.2 }, t);
  } else {
    // la racha, grande y de fondo, en medio del comal
    if (run && run.streak >= 3) {
      ctx.font = `${R * 0.5}px ${DISPLAY}`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.globalAlpha = 0.18 + (run.fever > 0 ? 0.12 : 0);
      ctx.fillStyle = run.fever > 0 ? '#ffb347' : '#fffaf0';
      ctx.fillText(`×${run.streak}`, CX, CY);
      ctx.globalAlpha = 1;
    }
    if (run) {
      // puestos todavía cerrados: tapadera con el nivel en que se abren
      const open = ACTIVE(run.level);
      for (let i = 0; i < 4; i++) {
        if (open.includes(i)) continue;
        const { x, y } = slotPos(i);
        ctx.beginPath(); ctx.arc(x, y, PR * 1.05, 0, Math.PI * 2);
        ctx.fillStyle = '#4a4952'; ctx.fill();
        ctx.lineWidth = 3 * S; ctx.strokeStyle = INK; ctx.stroke();
        ctx.beginPath(); ctx.arc(x, y - PR * 0.05, PR * 0.18, 0, Math.PI * 2);
        ctx.fillStyle = '#6b6a74'; ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,250,240,.75)';
        ctx.font = `${PR * 0.3}px ${DISPLAY}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(`Nivel ${i === 1 ? 2 : 3}`, x, y + PR * 0.45);
      }
    }
    for (const p of pupusas) if (p) drawPupusa(p, t);
  }
  drawFx();
  if (run && run.fever > 0 && state !== 'menu') {
    const k = 0.28 + Math.sin(t * 10) * 0.06;
    const v = ctx.createRadialGradient(CX, CY, R * 0.7, CX, CY, Math.max(W, H) * 0.75);
    v.addColorStop(0, 'rgba(255,90,0,0)'); v.addColorStop(1, `rgba(255,90,0,${k})`);
    ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    const bw = W * 0.5, bh = 10 * S, bx = CX - bw / 2, by = 50 * S;
    ctx.fillStyle = INK; ctx.fillRect(bx - 2 * S, by - 2 * S, bw + 4 * S, bh + 4 * S);
    ctx.fillStyle = '#ff7a1a'; ctx.fillRect(bx, by, bw * (run.fever / FEVER), bh);
  }
  if (flashT > 0) { ctx.fillStyle = `rgba(229,56,59,${flashT * 0.7})`; ctx.fillRect(0, 0, W, H); }
  ctx.restore();
}
