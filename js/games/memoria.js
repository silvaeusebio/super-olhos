// ===== Memória das Armações =====
GAMES.push({
  id: 'memoria', name: 'Memória dos Óculos', icon: '🃏', color: '#ab47bc', color2: '#6a1b9a',
  say: 'Descobre os pares de óculos iguais! Vira duas cartas de cada vez.',
  start(el, api) {
    const colors = shuffle(Art.COLORS).slice(0, 6);
    const styles = shuffle(Art.STYLES);
    const pairs = styles.map((st, i) => ({ key: i, svg: Art.glasses(st, colors[i].c, false) }));
    const deck = shuffle([...pairs, ...pairs]);

    el.innerHTML = `<div class="hud"><span>🔄 Jogadas: <b class="mv">0</b></span></div><div class="mem-grid ${isPortrait() ? 'portrait' : ''}"></div>`;
    const grid = el.querySelector('.mem-grid'), mvEl = el.querySelector('.mv');
    let open = [], lock = true, moves = 0, found = 0;
    const timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));

    const cards = deck.map(p => {
      const b = document.createElement('button');
      b.className = 'mcard up';
      b.innerHTML = `<div class="in"><div class="f">👁️</div><div class="b">${p.svg}</div></div>`;
      b.onclick = () => {
        if (lock || b.classList.contains('up') || b.classList.contains('done')) return;
        api.sfx('flip');
        b.classList.add('up'); open.push({ b, p });
        if (open.length === 2) {
          moves++; mvEl.textContent = moves; lock = true;
          const [a, c] = open;
          if (a.p.key === c.p.key) {
            later(() => {
              a.b.classList.add('done'); c.b.classList.add('done'); api.sfx('good');
              open = []; lock = false; found++;
              if (found === pairs.length) later(() => api.finish(moves <= 10 ? 3 : moves <= 16 ? 2 : 1, `Encontraste os pares em ${moves} jogadas!`), 700);
            }, 350);
          } else {
            later(() => { a.b.classList.remove('up'); c.b.classList.remove('up'); open = []; lock = false; }, 900);
          }
        }
      };
      grid.appendChild(b);
      return b;
    });

    // Mostra todas as cartas um bocadinho no início
    later(() => { cards.forEach(c => c.classList.remove('up')); api.sfx('flip'); lock = false; }, 2200);

    const onResize = () => grid.classList.toggle('portrait', isPortrait());
    window.addEventListener('resize', onResize);
    return () => { timers.forEach(clearTimeout); window.removeEventListener('resize', onResize); };
  },
});
