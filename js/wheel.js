// ===== Roda da Sorte =====
const Wheel = {
  cv: null, ctx: null, slices: [], rot: 0, spinning: false,

  init() {
    this.cv = $('#wheel-cv'); this.ctx = this.cv.getContext('2d');
    $('#spin-btn').onclick = () => this.spin();
    this.cv.addEventListener('pointerdown', () => this.spin());
    this.prepare();
  },

  // 40 fatias iguais; cada prémio recebe fatias conforme a percentagem (25/25/25/25 -> 10/10/10/10), espalhadas pela roda
  SLICES: 40,
  buildSlices() {
    const prizes = Store.cfg.prizes.filter(p => p.pct > 0);
    const tot = prizes.reduce((a, p) => a + p.pct, 0);
    const N = this.SLICES;
    // método dos maiores restos, cada prémio com pelo menos 1 fatia
    const raw = prizes.map(p => p.pct / tot * N);
    const cnt = raw.map(r => Math.max(1, Math.floor(r)));
    let left = N - cnt.reduce((a, b) => a + b, 0);
    const order = raw.map((r, i) => [r - Math.floor(r), i]).sort((x, y) => y[0] - x[0]);
    for (let k = 0; left > 0; k++, left--) cnt[order[k % order.length][1]]++;
    while (left < 0) { const i = cnt.indexOf(Math.max(...cnt)); cnt[i]--; left++; }
    const out = [];
    prizes.forEach((p, i) => { for (let j = 0; j < cnt[i]; j++) out.push({ p, pos: (j + 0.5) / cnt[i] + i * 1e-3 }); });
    out.sort((x, y) => x.pos - y.pos);
    const step = Math.PI * 2 / out.length;
    out.forEach((s, i) => { s.a0 = i * step; s.a1 = (i + 1) * step; });
    this.slices = out;
  },

  prepare() {
    this.buildSlices();
    this.spinning = false;
    $('#spin-btn').disabled = false;
    $('#wheel-hint').textContent = 'Toca em RODAR!';
    this.draw();
  },

  draw() {
    const c = this.ctx, S = this.cv.width, R = S / 2 - 18;
    c.clearRect(0, 0, S, S);
    c.save(); c.translate(S / 2, S / 2);
    // aro
    c.beginPath(); c.arc(0, 0, R + 14, 0, Math.PI * 2); c.fillStyle = '#14213d'; c.fill();
    c.rotate(this.rot);
    this.slices.forEach((s, i) => {
      c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, R, s.a0, s.a1); c.closePath();
      c.fillStyle = s.p.color; c.fill();
      c.lineWidth = 5; c.strokeStyle = '#fff'; c.stroke();
      // texto ao longo do raio
      const mid = (s.a0 + s.a1) / 2, span = s.a1 - s.a0;
      c.save(); c.rotate(mid);
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.font = `${Math.min(74, span * R * 0.5)}px serif`;
      c.fillText(s.p.icon, R * 0.76, 0);
      c.fillStyle = '#14213d';
      const label = s.p.short || s.p.name;
      let fs = Math.min(32, span * R * 0.38);
      c.font = `900 ${fs}px "Trebuchet MS", sans-serif`;
      const maxW = R * 0.34;
      const w = c.measureText(label).width;
      if (w > maxW) { fs *= maxW / w; c.font = `900 ${fs}px "Trebuchet MS", sans-serif`; }
      c.fillText(label, R * 0.52, 0);
      c.restore();
    });
    c.restore();
    // luzes do aro
    c.save(); c.translate(S / 2, S / 2);
    for (let i = 0; i < 40; i++) {
      const a = i / 40 * Math.PI * 2;
      c.beginPath(); c.arc(Math.cos(a) * (R + 7), Math.sin(a) * (R + 7), 5, 0, Math.PI * 2);
      c.fillStyle = (i + Math.floor(this.rot * 4)) % 2 ? '#fff59d' : '#c9a23a'; c.fill();
    }
    c.restore();
  },

  choosePrize() {
    const prizes = Store.cfg.prizes.filter(p => p.pct > 0);
    const tot = prizes.reduce((a, p) => a + p.pct, 0);
    let r = Math.random() * tot;
    for (const p of prizes) { if ((r -= p.pct) < 0) return p; }
    return prizes[prizes.length - 1];
  },

  spin() {
    if (this.spinning || !$('#wheel').classList.contains('active')) return;
    this.spinning = true;
    $('#spin-btn').disabled = true;
    $('#wheel-hint').textContent = 'A rodar... 🤞';
    Sfx.play('tap');

    const prize = this.choosePrize();
    const options = this.slices.filter(s => s.p === prize);
    const s = pick(options);
    const theta = s.a0 + (s.a1 - s.a0) * rand(0.2, 0.8);
    // o ponteiro está no topo (-90°): rot + theta = -PI/2 (mod 2PI)
    const base = -Math.PI / 2 - theta;
    const minEnd = this.rot + Math.PI * 2 * randi(5, 7);
    const k = Math.ceil((minEnd - base) / (Math.PI * 2));
    const end = base + k * Math.PI * 2;
    const startRot = this.rot, dur = 5200, t0 = performance.now();
    const peg = Math.PI * 2 / this.slices.length;
    let lastPeg = Math.floor(startRot / peg);

    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - t, 4);
      this.rot = startRot + (end - startRot) * e;
      const pg = Math.floor(this.rot / peg);
      if (pg !== lastPeg) { lastPeg = pg; Sfx.play('tick'); }
      this.draw();
      if (t < 1) requestAnimationFrame(step);
      else {
        this.rot = end % (Math.PI * 2);
        Store.stats.players++;
        Store.stats.given[prize.id] = (Store.stats.given[prize.id] || 0) + 1;
        Store.save();
        setTimeout(() => App.showPrize(prize), 700);
      }
    };
    requestAnimationFrame(step);
  },
};
