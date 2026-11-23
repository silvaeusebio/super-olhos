// ===== Torre de Caixas (adultos) — física real com Matter.js =====
GAMES.push({
  id: 'torre', group: 'adultos', name: 'Torre de Caixas', icon: '📦', color: '#5c6bc0', color2: '#283593',
  say: 'Toca no ecrã para largar a caixa. Empilha o mais alto que conseguires, sem deixar a torre cair!',
  start(el, api) {
    const M = Matter;
    el.innerHTML = `<div class="hud"><span>📦 <b class="s">0</b></span><span>🏆 <b class="b">0</b></span></div><canvas class="full"></canvas>
      <div class="torre-tip">Toca para largar a caixa</div>`;
    el.style.background = 'linear-gradient(180deg,#0d1b3a 0%,#1f3a6e 45%,#6fa8dc 100%)';
    const cv = el.querySelector('canvas'), ctx = cv.getContext('2d');
    const sEl = el.querySelector('.s'), bEl = el.querySelector('.b'), tip = el.querySelector('.torre-tip');
    let best = 0, newRecord = false;
    try { best = parseInt(localStorage.getItem('so_torre_best') || '0', 10) || 0; } catch (e) {}
    bEl.textContent = best;

    let W = 0, H = 0;
    const resize = () => {
      const r = cv.getBoundingClientRect(), d = window.devicePixelRatio || 1;
      W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    resize(); window.addEventListener('resize', resize);

    // Tamanhos fixos a partir do ecrã inicial (o mundo físico não muda de escala)
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const BW = clamp(Math.min(W, H * 1.2) * 0.2, 110, 200);   // largura da caixa
    const BH = BW * 0.5;
    const PW = BW * 1.25;                                    // largura do pedestal
    const CX = W / 2;                                        // centro do mundo (x)
    const HY = 0.18;                                         // altura da grua no ecrã

    const engine = M.Engine.create({ enableSleeping: true, positionIterations: 12, velocityIterations: 10 });
    engine.gravity.y = 1.1;
    const world = engine.world;
    // Pedestal (topo em y = 0) e chão
    const pedestal = M.Bodies.rectangle(CX, BH * 2, PW, BH * 4, { isStatic: true, friction: 1, label: 'ped' });
    const floor = M.Bodies.rectangle(CX, BH * 3.2, 6000, BH * 2, { isStatic: true, friction: 1, label: 'floor' });
    M.Composite.add(world, [pedestal, floor]);

    const imgs = Art.STYLES.map((st, i) => { const im = new Image(); im.src = Art.glassesDataURL(st, Art.COLORS[i].c, i % 3 === 2); return im; });
    const PAL = [['#14213d', '#c9a23a'], ['#c9a23a', '#14213d'], ['#1e88e5', '#fff'], ['#e53935', '#fff'], ['#43a047', '#fff'], ['#8e24aa', '#fff']];

    const boxes = [];          // caixas largadas
    let score = 0, state = 'aim', current = null, landedAt = 0, endAt = 0, lastTop = 0, clock = 0;
    let camY = -H * 0.86, hookX = CX, hookDir = 1, nextLook = 0, acc = 0, last = performance.now(), running = true;
    const look = () => ({ pal: PAL[nextLook % PAL.length], img: imgs[nextLook % imgs.length] });
    let held = look();

    const speed = () => Math.min(W * 0.55, W * 0.22 + score * W * 0.018);   // px/s, vai acelerando
    const towerTop = () => {
      let top = 0;
      for (const b of boxes) if (b !== current && b.position.y < BH) top = Math.min(top, b.bounds.min.y);
      return top;
    };

    function drop() {
      if (state !== 'aim') return;
      tip.classList.add('hidden');
      const y = camY + H * HY + BH * 0.5;
      const b = M.Bodies.rectangle(hookX, y, BW, BH, {
        friction: 0.9, frictionStatic: 1.2, restitution: 0, density: 0.002, slop: 0.02, label: 'box',
      });
      b.look = held; b.droppedAt = clock;
      M.Composite.add(world, b);
      boxes.push(b); current = b; state = 'falling'; landedAt = 0;
      api.sfx('flip');
    }
    cv.addEventListener('pointerdown', drop);
    el._torre = { get hookX() { return hookX; }, get state() { return state; }, CX, BW, get top() { return lastTop; } };  // para testes

    M.Events.on(engine, 'collisionStart', (ev) => {
      if (!current || state !== 'falling') return;
      for (const p of ev.pairs) {
        if ((p.bodyA === current || p.bodyB === current) && !landedAt) {
          landedAt = clock;
          const other = p.bodyA === current ? p.bodyB : p.bodyA;
          if (other.label !== 'floor') {
            api.sfx('block');
            const below = other.label === 'ped' ? CX : other.position.x;
            if (Math.abs(current.position.x - below) < BW * 0.06) {
              floatText(el, current.position.x, current.position.y - camY - BH, 'Perfeito!', '#ffd54f');
            }
          }
        }
      }
    });

    function gameOver() {
      state = 'end'; endAt = clock; api.sfx('bad');
      if (score > best) { best = score; newRecord = true; try { localStorage.setItem('so_torre_best', String(best)); } catch (e) {} bEl.textContent = best; }
    }

    function drawBox(b) {
      const [c1, c2] = b.look.pal;
      ctx.save(); ctx.translate(b.position.x, b.position.y - camY); ctx.rotate(b.angle);
      const w = BW, h = BH, r = h * 0.14;
      ctx.fillStyle = c1; ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-w / 2, -h / 2, w, h, r) : ctx.rect(-w / 2, -h / 2, w, h); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(-w / 2 + 3, -h / 2 + 3, w - 6, h * 0.18);
      ctx.strokeStyle = c2; ctx.lineWidth = Math.max(2, h * 0.06);
      ctx.strokeRect(-w / 2 + h * 0.12, -h / 2 + h * 0.12, w - h * 0.24, h - h * 0.24);
      const im = b.look.img;
      if (im.complete) { const gw = w * 0.55, gh = gw * 0.47; ctx.drawImage(im, -gw / 2, -gh / 2, gw, gh); }
      ctx.restore();
    }

    function frame(now) {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now; clock += dt;

      // física em passos fixos (mais estável)
      acc += dt * 1000;
      let n = 0;
      while (acc >= 1000 / 60 && n < 4) { M.Engine.update(engine, 1000 / 60); acc -= 1000 / 60; n++; }
      if (n === 4) acc = 0;

      // grua a andar de um lado para o outro
      if (state === 'aim') {
        hookX += hookDir * speed() * dt;
        const lim = Math.min(W * 0.42, BW * 1.8);
        if (hookX > CX + lim) { hookX = CX + lim; hookDir = -1; }
        if (hookX < CX - lim) { hookX = CX - lim; hookDir = 1; }
      }

      // alguma caixa caiu da torre?
      if (state !== 'end' && boxes.some(b => b.position.y > BH * 0.6)) gameOver();

      if (state === 'falling' && current) {
        const settled = landedAt && clock - landedAt > 0.55 && current.speed < 1.5;
        if (settled || clock - current.droppedAt > 4) {
          if (state !== 'end') {
            score++; sEl.textContent = score; api.sfx('good');
            current = null; nextLook++; held = look(); state = 'aim';
            if (score % 5 === 0) { floatText(el, W / 2 - 40, H * 0.3, `${score} caixas!`, '#fff'); }
          }
        }
      }

      // câmara sobe com a torre
      const top = towerTop();
      if (state !== 'end') lastTop = top;
      const target = Math.min(-H * 0.86, lastTop - H * 0.82);
      camY += (target - camY) * Math.min(1, dt * 3);

      // ---- desenhar ----
      ctx.clearRect(0, 0, W, H);
      // estrelas/nuvens de fundo ligadas à altura
      ctx.fillStyle = 'rgba(255,255,255,.5)';
      for (let i = 0; i < 40; i++) {
        const sx = (i * 197.3) % W, sy = ((i * 131.7 - camY * 0.3) % (H * 1.2) + H * 1.2) % (H * 1.2) - H * 0.1;
        ctx.fillRect(sx, sy, 2, 2);
      }
      // chão e pedestal
      ctx.fillStyle = '#2e4d2e'; ctx.fillRect(0, floor.bounds.min.y - camY, W, H);
      ctx.fillStyle = '#3d6b3d'; ctx.fillRect(0, floor.bounds.min.y - camY, W, 8);
      const px = CX - PW / 2, py = -camY;
      const pg = ctx.createLinearGradient(px, 0, px + PW, 0);
      pg.addColorStop(0, '#8f6f1c'); pg.addColorStop(0.5, '#f3d77a'); pg.addColorStop(1, '#8f6f1c');
      ctx.fillStyle = pg; ctx.fillRect(px, py, PW, floor.bounds.min.y - camY - py);
      ctx.fillStyle = '#14213d'; ctx.font = `900 ${BH * 0.32}px ${getComputedStyle(document.body).fontFamily}`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('ÓPTICAS EUSÉBIO', CX, py + BH * 0.6, PW * 0.9);

      for (const b of boxes) drawBox(b);

      // grua + caixa pendurada
      const hy = H * HY;
      ctx.strokeStyle = '#c9a23a'; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(0, hy - BH * 0.9); ctx.lineTo(W, hy - BH * 0.9); ctx.stroke();
      ctx.fillStyle = '#14213d'; ctx.fillRect(hookX - 22, hy - BH * 0.9 - 10, 44, 20);
      ctx.strokeStyle = '#cfd8dc'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(hookX, hy - BH * 0.9 + 10); ctx.lineTo(hookX, hy - (state === 'aim' ? 0 : BH * 0.4)); ctx.stroke();
      if (state === 'aim') {
        drawBox({ position: { x: hookX, y: hy + BH * 0.5 + camY }, angle: 0, look: held });
        // linha guia fraca
        ctx.strokeStyle = 'rgba(255,255,255,.15)'; ctx.setLineDash([6, 8]); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(hookX, hy + BH); ctx.lineTo(hookX, H); ctx.stroke(); ctx.setLineDash([]);
      }

      if (state === 'end' && clock - endAt > 2.2) {
        running = false;
        const cx = (n) => n === 1 ? '1 caixa' : `${n} caixas`;
        const msg = `O teu resultado: ${cx(score)}
` + (newRecord ? `🏆 NOVO RECORDE: ${cx(best)}!` : `🏆 Recorde: ${cx(best)}`);
        api.finish(score >= 15 ? 3 : score >= 7 ? 2 : 1, msg);
        return;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    return () => {
      running = false; window.removeEventListener('resize', resize); el.style.background = '';
      M.Events.off(engine); M.Composite.clear(world, false); M.Engine.clear(engine);
    };
  },
});
