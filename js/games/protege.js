// ===== Protege os Olhos (raios UV) =====
GAMES.push({
  id: 'protege', name: 'Protege os Olhos', icon: '😎', color: '#ffb300', color2: '#ef6c00',
  say: 'Os raios do sol querem chegar aos olhos! Toca neles para os rebentar. Apanha os óculos de sol para ficares protegido!',
  start(el, api) {
    const DURATION = 30;
    el.innerHTML = `<div class="protect"><div class="hud"><span>⏱️ <b class="t">${DURATION}</b></span><span>☀️ <b class="s">0</b></span><span class="hp">❤️❤️❤️❤️❤️</span></div><div class="face"></div></div>`;
    const box = el.querySelector('.protect'), face = el.querySelector('.face');
    const tEl = el.querySelector('.t'), sEl = el.querySelector('.s'), hpEl = el.querySelector('.hp');
    let W = box.clientWidth, H = box.clientHeight;
    let rays = [], time = DURATION, elapsed = 0, spawnT = 0.5, puT = 5, shades = 0, ouch = 0, hits = 0, score = 0, last = performance.now(), running = true, lastShown = DURATION;
    let powerup = null, faceState = '';

    const center = () => ({ x: W / 2, y: H * 0.55 });
    const faceR = () => Math.min(W, H) * 0.19;
    const sizeFace = () => { W = box.clientWidth; H = box.clientHeight; const s = faceR() * 2.2; face.style.width = face.style.height = s + 'px'; };
    sizeFace(); window.addEventListener('resize', sizeFace);
    const drawFace = () => {
      const st = (ouch > 0) + '|' + (shades > 0);
      if (st !== faceState) { faceState = st; face.innerHTML = Art.kid(ouch > 0, shades > 0); }
    };
    drawFace();

    function spawnRay() {
      const c = center(), a = rand(0, Math.PI * 2), d = Math.hypot(W, H) * 0.55;
      const r = { x: c.x + Math.cos(a) * d, y: c.y + Math.sin(a) * d, el: document.createElement('div') };
      r.x = Math.max(30, Math.min(W - 30, r.x)); r.y = Math.max(70, Math.min(H - 30, r.y));
      const dist = Math.hypot(c.x - r.x, c.y - r.y);
      r.speed = dist / Math.max(2.4, 5.2 - elapsed * 0.09);
      r.el.className = 'ray'; r.el.textContent = 'UV';
      r.el.addEventListener('pointerdown', (e) => {
        e.stopPropagation(); if (r.dead) return; r.dead = true;
        score++; sEl.textContent = score; api.sfx('pop'); boom(r.x, r.y, '💥');
      });
      box.appendChild(r.el); rays.push(r);
    }
    function boom(x, y, ch) {
      const b = document.createElement('div'); b.className = 'boom'; b.textContent = ch;
      b.style.left = x + 'px'; b.style.top = y + 'px'; box.appendChild(b); setTimeout(() => b.remove(), 650);
    }
    function spawnPowerup() {
      const p = document.createElement('div'); p.className = 'powerup'; p.innerHTML = Art.glasses('aviator', '#263238', true);
      const x = rand(70, W - 70), y = rand(110, H - 70);
      const c = center(); if (Math.hypot(x - c.x, y - c.y) < faceR() * 1.6) return;
      p.style.left = x + 'px'; p.style.top = y + 'px';
      p.addEventListener('pointerdown', (e) => {
        e.stopPropagation(); api.sfx('win'); shades = 6; p.remove(); powerup = null; api.say('Óculos de sol!');
      });
      box.appendChild(p); powerup = { el: p, life: 3.5 };
    }

    function frame(now) {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      elapsed += dt; time -= dt; shades = Math.max(0, shades - dt); ouch = Math.max(0, ouch - dt);
      spawnT -= dt; puT -= dt;
      if (spawnT <= 0) { spawnRay(); if (elapsed > 12 && Math.random() < 0.3) spawnRay(); spawnT = Math.max(0.6, 1.6 - elapsed * 0.035); }
      if (puT <= 0 && !powerup) { spawnPowerup(); puT = rand(8, 11); }
      if (powerup && (powerup.life -= dt) <= 0) { powerup.el.remove(); powerup = null; }

      const c = center(), fr = faceR();
      for (const r of rays) {
        if (r.dead) continue;
        const dx = c.x - r.x, dy = c.y - r.y, d = Math.hypot(dx, dy);
        if (d < fr) {
          r.dead = true;
          if (shades > 0) { api.sfx('block'); score++; sEl.textContent = score; boom(r.x, r.y, '✨'); }
          else {
            hits++; ouch = 0.7; api.sfx('bad'); boom(r.x, r.y, '😖');
            hpEl.textContent = '❤️'.repeat(Math.max(0, 5 - hits)) + '🤍'.repeat(Math.min(5, hits));
            face.classList.remove('ouch'); void face.offsetWidth; face.classList.add('ouch');
            const f = document.createElement('div'); f.className = 'redflash'; box.appendChild(f); setTimeout(() => f.remove(), 450);
          }
          continue;
        }
        r.x += dx / d * r.speed * dt; r.y += dy / d * r.speed * dt;
        r.el.style.left = r.x + 'px'; r.el.style.top = r.y + 'px';
      }
      rays = rays.filter(r => { if (r.dead) r.el.remove(); return !r.dead; });
      drawFace();

      const shown = Math.max(0, Math.ceil(time));
      if (shown !== lastShown) { lastShown = shown; tEl.textContent = shown; }
      if (time <= 0 || hits >= 5) {
        running = false;
        api.finish(hits <= 1 ? 3 : hits <= 3 ? 2 : 1, score === 1 ? 'Rebentaste 1 raio de sol!' : `Rebentaste ${score} raios de sol!`);
        return;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return () => { running = false; window.removeEventListener('resize', sizeFace); };
  },
});
