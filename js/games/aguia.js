// ===== Olho de Águia (letra E que roda) =====
GAMES.push({
  id: 'aguia', name: 'Olho de Águia', icon: '🦅', color: '#26a69a', color2: '#00695c',
  say: 'Para onde apontam as pernas do E? Toca na seta certa! O E vai ficar cada vez mais pequenino.',
  start(el, api) {
    const MAX = 12;
    el.innerHTML = `
      <div class="hud"><span class="lv">Nível 1</span><span class="lives">❤️❤️❤️</span></div>
      <div class="eagle">
        <div class="chart"><div class="E">${Art.letterE()}</div></div>
        <div class="arrows">
          <span></span><button data-d="3">⬆️</button><span></span>
          <button data-d="2">⬅️</button><button data-d="1">⬇️</button><button data-d="0">➡️</button>
        </div>
        <p class="disclaimer">Isto é só uma brincadeira, não é um exame à vista! 😉 Para isso, fala com o optometrista.</p>
      </div>`;
    const E = el.querySelector('.E'), chart = el.querySelector('.chart');
    const lvEl = el.querySelector('.lv'), livesEl = el.querySelector('.lives');
    let level = 0, lives = 3, dir = 0, lock = false;
    const timers = [];

    const size = () => Math.max(9, Math.round(Math.min(chart.clientHeight * 0.7, 190) * Math.pow(0.76, level)));
    const next = () => {
      let d; do { d = randi(0, 3); } while (d === dir && Math.random() < 0.7);
      dir = d;
      const s = size();
      E.style.width = E.style.height = s + 'px';
      E.style.transform = `rotate(${dir * 90}deg)`;
      lvEl.textContent = `Nível ${level + 1}`;
      chart.classList.remove('ok', 'bad');
      lock = false;
    };
    el.querySelectorAll('.arrows button').forEach(b => b.onclick = () => {
      if (lock) return; lock = true;
      if (+b.dataset.d === dir) {
        api.sfx('good'); chart.classList.add('ok'); level++;
        if (level >= MAX) { timers.push(setTimeout(() => api.finish(3, `Acertaste todos os ${MAX} níveis! 🦅`), 500)); return; }
        timers.push(setTimeout(next, 450));
      } else {
        api.sfx('bad'); chart.classList.add('bad'); lives--;
        livesEl.textContent = '❤️'.repeat(lives) + '🤍'.repeat(3 - lives);
        if (lives <= 0) { timers.push(setTimeout(() => api.finish(level >= 8 ? 3 : level >= 4 ? 2 : 1, level === 1 ? 'Acertaste 1 vez!' : `Acertaste ${level} vezes!`), 700)); return; }
        timers.push(setTimeout(next, 700));
      }
    });
    next();
    return () => timers.forEach(clearTimeout);
  },
});
