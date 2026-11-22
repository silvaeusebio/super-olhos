// ===== Encontra as Diferenças =====
GAMES.push({
  id: 'diferencas', name: 'Encontra as Diferenças', icon: '🔍', color: '#66bb6a', color2: '#2e7d32',
  say: 'As duas imagens têm cinco diferenças. Toca onde estão!',
  start(el, api) {
    const N = 5;
    const POOL = ['🌳', '🌻', '🌷', '🏠', '🐶', '🐱', '🐦', '🦋', '🍎', '⚽', '🚲', '🎈', '🐞', '🍄', '👓', '🕶️', '🐸', '🐰', '🚗', '🍦', '🐌', '⭐', '🐝', '🍓'];
    const pool = shuffle(POOL);
    const objs = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
      objs.push({ x: 50 + c * 100 + rand(-16, 16), y: 52 + r * 98 + rand(-12, 12), e: pool.pop(), s: rand(44, 56) });
    }
    const spare = pool;
    const diffs = shuffle(objs.map((_, i) => i)).slice(0, N).map((i, k) => {
      const type = ['gone', 'swap', 'big', 'swap', 'gone'][k];
      return { i, type, alt: type === 'swap' ? spare.pop() : null, found: false };
    });

    const scene = (variant) => {
      let s = `<rect width="400" height="300" fill="#bbdefb"/>
        <circle cx="360" cy="30" r="40" fill="#fff59d" opacity=".7"/>
        <path d="M0,170 Q100,130 200,165 T400,160 V300 H0Z" fill="#aed581"/>
        <path d="M0,220 Q120,190 240,220 T400,215 V300 H0Z" fill="#8bc34a"/>`;
      objs.forEach((o, i) => {
        const d = variant === 'B' ? diffs.find(d => d.i === i) : null;
        if (d && d.type === 'gone') return;
        const e = d && d.type === 'swap' ? d.alt : o.e;
        const sz = d && d.type === 'big' ? o.s * 1.6 : o.s;
        s += `<text x="${o.x.toFixed(1)}" y="${o.y.toFixed(1)}" font-size="${sz.toFixed(1)}" text-anchor="middle" dominant-baseline="central">${e}</text>`;
      });
      return `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">${s}<g class="marks"></g></svg>`;
    };

    el.innerHTML = `
      <div class="hud"><span>🔍 <b class="f">0</b>/${N}</span></div>
      <div class="diff ${isPortrait() ? 'portrait' : ''}">
        <button class="icon-btn hintbtn" aria-label="Ajuda">💡</button>
        <div class="pane">${scene('A')}</div><div class="pane">${scene('B')}</div>
      </div>`;
    const svgs = [...el.querySelectorAll('.diff svg')];
    const fEl = el.querySelector('.f');
    let found = 0, wrong = 0, hints = 0, done = false;
    const timers = [];

    const mark = (x, y, cls, color, r = 34) => svgs.map(s => {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', r);
      c.setAttribute('fill', 'none'); c.setAttribute('stroke', color); c.setAttribute('stroke-width', '6');
      if (cls) c.setAttribute('class', cls);
      s.querySelector('.marks').appendChild(c); return c;
    });

    svgs.forEach(svg => svg.addEventListener('pointerdown', (e) => {
      if (done) return;
      const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
      const p = pt.matrixTransform(svg.getScreenCTM().inverse());
      const hit = diffs.find(d => !d.found && Math.hypot(objs[d.i].x - p.x, objs[d.i].y - p.y) < Math.max(38, objs[d.i].s * (d.type === 'big' ? 1.1 : 0.8)));
      if (hit) {
        hit.found = true; found++; fEl.textContent = found; api.sfx('good');
        const o = objs[hit.i]; mark(o.x, o.y, '', '#e53935', hit.type === 'big' ? 48 : 36);
        if (found === N) { done = true; timers.push(setTimeout(() => api.finish(wrong + hints * 2 <= 3 ? 3 : wrong + hints * 2 <= 8 ? 2 : 1, `Encontraste as ${N} diferenças!`), 800)); }
      } else {
        wrong++; api.sfx('bad');
        const ms = mark(p.x, p.y, '', '#90a4ae', 14);
        timers.push(setTimeout(() => ms.forEach(m => m.remove()), 500));
      }
    }));

    el.querySelector('.hintbtn').onclick = () => {
      const d = diffs.find(d => !d.found); if (!d || done) return;
      hints++; api.sfx('pop');
      const o = objs[d.i];
      const ms = mark(o.x, o.y, '', '#ffb300', 50);
      ms.forEach(m => m.innerHTML = '<animate attributeName="r" values="50;30;50" dur=".6s" repeatCount="3"/>');
      timers.push(setTimeout(() => ms.forEach(m => m.remove()), 1800));
    };

    const onResize = () => el.querySelector('.diff').classList.toggle('portrait', isPortrait());
    window.addEventListener('resize', onResize);
    return () => { timers.forEach(clearTimeout); window.removeEventListener('resize', onResize); };
  },
});
