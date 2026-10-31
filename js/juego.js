// ¡Volteala! — Lógica de una partida: aparecer pupusas, calificar toques, puntos, niveles, quemadas.

// todo lo de una partida vive aquí; "log" guarda el resultado de cada toque (P, B, C, X, Q)
function newRun() {
  return { score: 0, streak: 0, bestStreak: 0, perf: 0, served: 0, lives: LIVES, n: 0,
    t: 0, nextSpawn: 0.4, level: 1, fever: 0, fevers: 0, beat: 0, beats: 0, log: [] };
}

function spawn() {
  const free = ACTIVE(run.level).filter((i) => !pupusas[i]);
  if (!free.length) return;
  const slot = free[Math.floor(Math.random() * free.length)];
  // dorada: vale ×3 pero se cocina más rápido
  const gold = run.n >= 4 && Math.random() < 0.14;
  const cook = cookFor(run.level) * (0.88 + Math.random() * 0.24) * (gold ? 0.7 : 1);
  if (gold) {
    const { x, y } = slotPos(slot);
    say('¡Dorada! ×3', x, y - PR * 1.5, { size: 22, color: '#ffd23f', life: 1.1 });
    snd.gold();
  }
  pupusas[slot] = { slot, side: 0, d: 0, cook, gold, kick: 0, st: 'cook', age: 0, at: 0, res: [], dShow: 0, tut: run.n < 2,
    fill: FILLINGS[(Math.random() * FILLINGS.length) | 0],
    spots: Array.from({ length: 7 }, () => ({ a: rand(0, Math.PI * 2), r: Math.sqrt(Math.random()) * 0.75, s: rand(0.08, 0.16) })) };
  run.n++;
  run.nextSpawn = run.t + gapFor(run.level) + Math.random() * 0.4;
}

function levelUp() {
  run.level++;
  const opens = run.level <= 3;
  say(`¡Nivel ${run.level}!`, CX, CY - 24 * S, { size: 40, color: '#ffd23f', life: 1.8, vy: -8 });
  say(opens ? 'Se abre otro puesto' : 'Más fuego', CX, CY + 18 * S, { size: 22, life: 1.8, vy: -8 });
  if (run.lives < LIVES) {
    run.lives++;
    say('+1 vida', CX, CY + 50 * S, { size: 22, color: '#9be88c', life: 1.8, vy: -8 });
  }
  burst(CX, CY, ['#ffd23f', '#ff5fa2', '#3fbf6a', '#3f8cff', '#fffaf0'], 44, 360);
  // un respiro antes de que lleguen más
  run.nextSpawn = Math.max(run.nextSpawn, run.t + 1.6);
  heat = Math.min(1, (run.level - 1) / 8);
  setPill();
  snd.levelUp();
}

function setPill() {
  $('modePill').textContent = run && state !== 'menu' ? `Nivel ${run.level}` : `Récord: ${fmt(best)}`;
}

function grade(d) {
  if (d < Z_GOOD) return 'C';
  if (d < Z_PERF) return 'B';
  if (d <= Z_PERF_END) return 'P';
  if (d <= Z_DONE) return 'B';
  return 'X';
}

function tap(p) {
  if (state !== 'play' || p.st !== 'cook') return;
  const g = grade(p.d);
  const { x, y } = slotPos(p.slot);
  const mult = (run.fever > 0 ? 2 : 1) * (p.gold ? 3 : 1);
  let pts = 0;
  if (g === 'P') {
    run.streak++; run.perf++;
    run.bestStreak = Math.max(run.bestStreak, run.streak);
    // 10 puntos, +1 por cada perfecta seguida (hasta 20)
    pts = (10 + Math.min(run.streak - 1, 10)) * mult;
    say(`¡Perfecta! +${pts}`, x, y - PR * 1.1, { size: mult > 1 ? 26 : 22, color: '#ffd23f' });
    burst(x, y, ['#ffd23f', '#22b04a', '#fffaf0', '#ff7a1a'], 18, 240);
    p.kick = 1;
    shake(0.06);
    snd.perfect(run.streak);
    streakBump();
    if (run.fever > 0) run.fever = Math.min(FEVER, run.fever + 0.6);
    else if (run.streak % FEVER_AT === 0) startFever();
    else if (run.streak % 5 === 0) say(`¡Racha de ${run.streak}!`, CX, CY, { size: 34, color: '#ff5fa2', life: 1.3, vy: -20 });
  } else if (g === 'B') {
    pts = 4 * mult;
    say(`Bien +${pts}`, x, y - PR * 1.1, { size: 19 });
    snd.good();
  } else if (g === 'C') {
    breakStreak();
    pts = -CRUDA;
    say(`¡Cruda! −${CRUDA}`, x, y - PR * 1.1, { size: 20, color: '#ff8a8a' });
    snd.raw();
  } else {
    breakStreak();
    pts = 1 * mult;
    say(`Pasadita +${pts}`, x, y - PR * 1.1, { size: 19, color: '#ffb347' });
    snd.raw();
  }
  run.score = Math.max(0, run.score + pts);
  run.log.push(g);
  p.res.push(g);
  p.dShow = p.d;
  if (p.side === 0) {
    p.st = 'flip'; p.at = 0;
    snd.flip();
    if (p.tut) say('¡Volteada! Otra vez al verde', x, y + PR * 1.7, { size: 17, life: 1.6, vy: -10 });
  } else {
    p.st = 'out'; p.at = 0;
    run.served++;
    if (run.served % PER_LEVEL === 0) levelUp();
    if (p.res[0] === 'P' && p.res[1] === 'P') {
      run.score += 10;
      say('¡Doble perfecta! +10', x, y - PR * 1.6, { size: 20, color: '#ff5fa2', life: 1.3 });
    }
    snd.serve();
  }
}

function startFever() {
  run.fever = FEVER;
  run.fevers++;
  say('¡COMAL EN LLAMAS!', CX, CY - 22 * S, { size: 36, color: '#ffb347', life: 1.6, vy: -10 });
  say('Puntos ×2', CX, CY + 22 * S, { size: 24, color: '#fffaf0', life: 1.6, vy: -10 });
  burst(CX, CY, ['#ff7a1a', '#ffd23f', '#e5383b', '#fffaf0'], 40, 380);
  shake(0.35);
  snd.fever();
}
function breakStreak() {
  run.streak = 0;
  if (run.fever > 0) {
    run.fever = 0;
    say('Se apagó el fuego', CX, CY, { size: 24, color: '#f3ecdf', life: 1.1, vy: -15 });
  }
}

function burn(p) {
  const { x, y } = slotPos(p.slot);
  p.st = 'burn'; p.at = 0; p.dShow = Z_BURN;
  breakStreak();
  run.lives = Math.max(0, run.lives - 1);
  run.log.push('Q');
  say('¡Se quemó!', x, y - PR * 1.1, { size: 24, color: '#ff5a5f', life: 1.2 });
  for (let i = 0; i < 10; i++) smoke.push({ x: x + rand(-PR, PR) * 0.6, y, r: rand(6, 12) * S, life: 1.4, max: 1.4, dark: true });
  shake(0.3); flashT = 0.3;
  const lc = $('livesChip');
  lc.classList.remove('hurt'); void lc.offsetWidth; lc.classList.add('hurt');
  snd.burn();
  if (run.lives === 0) { state = 'ending'; endT = 1.1; }
}

function update(dt) {
  shakeT = Math.max(0, shakeT - dt);
  flashT = Math.max(0, flashT - dt);
  updateFx(dt);
  if (state === 'ending') {
    endT -= dt;
    if (endT <= 0) endGame();
  }
  if (state !== 'play' && state !== 'ending') return;
  const live = state === 'play';
  if (live) {
    run.t += dt;
    if (run.t >= run.nextSpawn) spawn();
    if (run.fever > 0) {
      run.fever = Math.max(0, run.fever - dt);
      if (run.fever === 0) say('Se apagó el fuego', CX, CY, { size: 24, color: '#f3ecdf', life: 1.1, vy: -15 });
    }
    // ritmo de fondo: corcheas que se aceleran con el fuego
    const bpm = 104 + heat * 56 + (run.fever > 0 ? 24 : 0);
    run.beat += (dt * bpm * 2) / 60;
    while (run.beat >= 1) { run.beat -= 1; run.beats++; snd.tick(run.beats, run.fever > 0); }
  }
  for (const p of pupusas) {
    if (!p) continue;
    p.age += dt;
    p.kick = Math.max(0, (p.kick || 0) - dt * 5);
    if (p.st === 'cook') {
      if (!live) continue;
      // en el verde se cocina más despacio: da tiempo de atenderla
      const inGreen = p.d >= Z_PERF && p.d <= Z_PERF_END;
      p.d += (dt / p.cook) * (inGreen ? GREEN_RATE : 1);
      // avisos por sonido: campanita al estar lista, alarma que se acelera al quemarse
      if (!p.cuePerf && p.d >= Z_PERF) { p.cuePerf = true; snd.ready(p.slot); }
      if (p.d >= Z_DONE) {
        p.alarmT = (p.alarmT || 0) - dt;
        if (p.alarmT <= 0) {
          const k = (p.d - Z_DONE) / (Z_BURN - Z_DONE);
          p.alarmT = 0.3 - k * 0.18;
          snd.alarm(k);
        }
      }
      if (p.d >= Z_DONE && Math.random() < dt * 8) {
        const { x, y } = slotPos(p.slot);
        smoke.push({ x: x + rand(-PR, PR) * 0.5, y: y - PR * 0.2, r: rand(4, 8) * S, life: 1, max: 1, dark: p.d > 1.12 });
      }
      if (p.d >= Z_BURN) burn(p);
    } else if (p.st === 'flip') {
      p.at += dt;
      if (p.at >= 0.28) { p.st = 'cook'; p.side = 1; p.d = 0; p.age = 0.3; p.cuePerf = false; p.alarmT = 0; }
    } else {
      p.at += dt;
      if ((p.st === 'out' && p.at >= 0.45) || (p.st === 'burn' && p.at >= 0.7)) pupusas[p.slot] = null;
    }
  }
}
