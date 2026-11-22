// ===== Apanha os Óculos =====
GAMES.push({
  id: 'apanha', name: 'Apanha os Óculos', icon: '🧺', color: '#29b6f6', color2: '#0277bd',
  say: 'Arrasta o cesto e apanha os óculos! Foge das nuvens de chuva!',
  start(el, api) {
    const DURATION = 35;
    el.innerHTML = `<div class="hud"><span>⏱️ <b class="t">${DURATION}</b></span><span>👓 <b class="s">0</b></span></div><canvas class="full"></canvas>`;
    el.style.background = 'linear-gradient(180deg,#b3e5fc,#e1f5fe 70%,#a5d6a7 70%,#81c784)';
    const cv = el.querySelector('canvas'), ctx = cv.getContext('2d');
    const tEl = el.querySelector('.t'), sEl = el.querySelector('.s');
    let W = 0, H = 0;
    const resize = () => {
      const r = cv.getBoundingClientRect(), d = window.devicePixelRatio || 1;
      W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    resize(); window.addEventListener('resize', resize);

    const imgs = Art.STYLES.map((st, i) => { const im = new Image(); im.src = Art.glassesDataURL(st, Art.COLORS[i].c, i % 3 === 2); return im; });
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const BW = () => clamp(W * 0.2, 170, 270);          // largura do cesto
    const GW = () => clamp(W * 0.13, 130, 200);         // largura dos óculos
    const basket = { x: W / 2, target: W / 2 };
    let items = [], pile = [], score = 0, time = DURATION, spawnT = 0.3, shake = 0, elapsed = 0, last = performance.now(), running = true, lastShown = DURATION;

    const move = (e) => { const r = cv.getBoundingClientRect(); basket.target = e.clientX - r.left; };
    cv.addEventListener('pointerdown', move); cv.addEventListener('pointermove', move);

    // ---- cesto de palha: parte de trás (interior + asa) ----
    function basketGeom(x) {
      const B = BW(), h = B * 0.6, bottom = H - 8, top = bottom - h;
      return { B, h, bottom, top, x, rx: B / 2, ry: B * 0.11 };
    }
    function drawBack(g) {
      // asa
      ctx.lineWidth = g.B * 0.07; ctx.strokeStyle = '#b8863b'; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.ellipse(g.x, g.top, g.rx * 0.82, g.h * 0.95, 0, Math.PI, 0); ctx.stroke();
      ctx.lineWidth = g.B * 0.025; ctx.strokeStyle = '#e8c170';
      ctx.beginPath(); ctx.ellipse(g.x, g.top, g.rx * 0.82, g.h * 0.95, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
      // interior
      ctx.fillStyle = '#7a4f22';
      ctx.beginPath(); ctx.ellipse(g.x, g.top, g.rx, g.ry, 0, 0, Math.PI * 2); ctx.fill();
    }
    function drawFront(g) {
      const { x, B, top, bottom, rx, ry } = g;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x - rx, top);
      ctx.bezierCurveTo(x - rx, top + g.h * 0.5, x - rx * 0.82, bottom, x - rx * 0.7, bottom);
      ctx.lineTo(x + rx * 0.7, bottom);
      ctx.bezierCurveTo(x + rx * 0.82, bottom, x + rx, top + g.h * 0.5, x + rx, top);
      ctx.ellipse(x, top, rx, ry, 0, 0, Math.PI, false);
      ctx.closePath();
      const gr = ctx.createLinearGradient(x - rx, 0, x + rx, 0);
      gr.addColorStop(0, '#c99a4a'); gr.addColorStop(0.45, '#f0cd7c'); gr.addColorStop(1, '#b8863b');
      ctx.fillStyle = gr; ctx.fill();
      ctx.clip();
      // entrançado
      ctx.strokeStyle = 'rgba(122,79,34,.45)'; ctx.lineWidth = 3;
      const rows = 5;
      for (let i = 1; i <= rows; i++) {
        const y = top + ry + (bottom - top - ry) * i / (rows + 1);
        ctx.beginPath(); ctx.ellipse(x, y - ry * 0.6, rx * 1.05, ry * 0.9, 0, 0, Math.PI); ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(122,79,34,.3)'; ctx.lineWidth = 2;
      for (let i = -6; i <= 6; i++) {
        ctx.beginPath(); ctx.moveTo(x + i * B / 13, top); ctx.lineTo(x + i * B / 13 * 0.75, bottom); ctx.stroke();
      }
      ctx.restore();
      // aro da frente (trança)
      ctx.lineWidth = B * 0.06; ctx.strokeStyle = '#b8863b';
      ctx.beginPath(); ctx.ellipse(x, top, rx, ry, 0, 0, Math.PI); ctx.stroke();
      ctx.lineWidth = B * 0.02; ctx.strokeStyle = '#f3d999'; ctx.setLineDash([B * 0.05, B * 0.04]);
      ctx.beginPath(); ctx.ellipse(x, top, rx, ry, 0, 0.1, Math.PI - 0.1); ctx.stroke();
      ctx.setLineDash([]);
    }

    function frame(now) {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      elapsed += dt; time -= dt;
      basket.x += (basket.target - basket.x) * Math.min(1, dt * 18);
      basket.x = clamp(basket.x, BW() / 2, W - BW() / 2);

      spawnT -= dt;
      if (spawnT <= 0) {
        spawnT = Math.max(0.5, 1.1 - elapsed * 0.016);
        const bad = elapsed > 4 && Math.random() < 0.25;
        items.push({ x: rand(GW() / 2 + 10, W - GW() / 2 - 10), y: -60, vy: rand(150, 200) + elapsed * 5, bad, img: pick(imgs), rot: rand(-0.15, 0.15), ph: rand(0, 6) });
      }
      shake = Math.max(0, shake - dt);
      const sx = shake > 0 ? Math.sin(now / 25) * 10 : 0;
      const g = basketGeom(basket.x + sx);

      for (const it of items) {
        const prevY = it.y;
        it.y += it.vy * dt;
        if (it.in) { it.x += (g.x + it.dx - it.x) * Math.min(1, dt * 12); continue; }
        // passa pela boca do cesto?
        if (prevY < g.top && it.y >= g.top && Math.abs(it.x - g.x) < g.rx - 8) {
          it.in = true; it.dx = it.x - g.x; it.vy = Math.min(it.vy, 260);
          if (it.bad) { score = Math.max(0, score - 1); shake = 0.4; api.sfx('bad'); floatText(el, g.x, g.top - 40, '-1', '#c62828'); }
          else {
            score++; api.sfx('good'); floatText(el, g.x, g.top - 40, '+1');
            pile.push({ img: it.img, dx: clamp(it.dx, -g.rx * 0.5, g.rx * 0.5), rot: rand(-0.5, 0.5) });
            if (pile.length > 5) pile.shift();
          }
          sEl.textContent = score;
        }
      }
      items = items.filter(it => (it.in ? it.y < g.top + g.h * 0.5 : it.y < H + 80));
      if (shake > 0.35) pile.pop();

      // desenhar: trás do cesto, óculos já apanhados, objetos, frente do cesto
      ctx.clearRect(0, 0, W, H);
      drawBack(g);
      const gw = GW(), gh = gw * 0.47;
      for (const p of pile) {
        ctx.save(); ctx.translate(g.x + p.dx, g.top + g.ry * 0.2); ctx.rotate(p.rot);
        if (p.img.complete) ctx.drawImage(p.img, -gw * 0.4, -gh * 0.4, gw * 0.8, gh * 0.8);
        ctx.restore();
      }
      for (const it of items) {
        ctx.save(); ctx.translate(it.x, it.y); ctx.rotate(it.rot + Math.sin(now / 280 + it.ph) * 0.18);
        if (it.bad) { ctx.font = `${gw * 0.62}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🌧️', 0, 0); }
        else if (it.img.complete) ctx.drawImage(it.img, -gw / 2, -gh / 2, gw, gh);
        ctx.restore();
      }
      drawFront(g);

      const shown = Math.max(0, Math.ceil(time));
      if (shown !== lastShown) { lastShown = shown; tEl.textContent = shown; if (shown <= 5 && shown > 0) api.sfx('tick'); }
      if (time <= 0) {
        running = false;
        api.finish(score >= 18 ? 3 : score >= 9 ? 2 : 1, score === 1 ? 'Apanhaste uns óculos!' : `Apanhaste ${score} óculos!`);
        return;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    return () => { running = false; window.removeEventListener('resize', resize); el.style.background = ''; };
  },
});
