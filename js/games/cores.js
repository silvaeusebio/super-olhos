// ===== Cores Malucas =====
GAMES.push({
  id: 'cores', name: 'Cores Malucas', icon: '🎨', color: '#ec407a', color2: '#ad1457',
  say: 'De que cor são os óculos? Toca na cor certa, depressa!',
  start(el, api) {
    const ROUNDS = 12;
    el.innerHTML = `
      <div class="hud"><span>🎯 <b class="r">1</b>/${ROUNDS}</span><span>✅ <b class="s">0</b></span></div>
      <div class="colors"><div class="target"></div><div class="tbar"><i></i></div><div class="copts"></div></div>`;
    const target = el.querySelector('.target'), bar = el.querySelector('.tbar i'), opts = el.querySelector('.copts');
    const rEl = el.querySelector('.r'), sEl = el.querySelector('.s');
    let round = 0, score = 0, cur = null, tLeft = 0, tMax = 0, lock = true, running = true, last = performance.now();
    const timers = [];

    function next() {
      if (round >= ROUNDS) { running = false; api.finish(score >= 11 ? 3 : score >= 7 ? 2 : 1, `Acertaste ${score} de ${ROUNDS} cores!`); return; }
      round++; rEl.textContent = round;
      const n = round <= 4 ? 3 : round <= 8 ? 4 : 6;
      cur = pick(Art.COLORS);
      const choices = shuffle([cur, ...shuffle(Art.COLORS.filter(c => c !== cur)).slice(0, n - 1)]);
      target.innerHTML = Art.glasses(pick(Art.STYLES), cur.c, false);
      opts.innerHTML = '';
      choices.forEach(c => {
        const b = document.createElement('button'); b.style.background = c.c; b.setAttribute('aria-label', c.n);
        b.onpointerdown = () => answer(c, b);
        opts.appendChild(b);
      });
      tMax = tLeft = Math.max(2.6, 6 - round * 0.3);
      lock = false;
    }
    function answer(c, b) {
      if (lock) return; lock = true;
      if (c === cur) { score++; sEl.textContent = score; api.sfx('good'); b.classList.add('right'); }
      else {
        api.sfx('bad'); b.classList.add('wrong');
        [...opts.children].forEach(x => { if (x.getAttribute('aria-label') === cur.n) x.classList.add('right'); });
      }
      timers.push(setTimeout(next, c === cur ? 450 : 900));
    }
    function frame(now) {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!lock) {
        tLeft -= dt;
        if (tLeft <= 0) {
          lock = true; api.sfx('bad');
          [...opts.children].forEach(x => { if (x.getAttribute('aria-label') === cur.n) x.classList.add('right'); });
          timers.push(setTimeout(next, 900));
        }
      }
      bar.style.width = Math.max(0, tLeft / tMax * 100) + '%';
      requestAnimationFrame(frame);
    }
    next(); requestAnimationFrame(frame);
    return () => { running = false; timers.forEach(clearTimeout); };
  },
});
