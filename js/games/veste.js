// ===== Veste os Animais =====
GAMES.push({
  id: 'veste', name: 'Veste os Animais', icon: '🐱', color: '#ff7043', color2: '#d84315',
  say: 'Escolhe um animal e põe-lhe uns óculos bonitos! Depois tira uma fotografia!',
  start(el, api) {
    const st = { animal: pick(Object.keys(Art.ANIMALS)), style: pick(Art.STYLES), color: pick(Art.COLORS).c, sun: false };
    el.innerHTML = `
      <div class="dress ${isPortrait() ? 'portrait' : ''}">
        <div class="pv"></div>
        <div class="ctl">
          <h3>🐾 Animal</h3><div class="opts o-an"></div>
          <h3>👓 Óculos</h3><div class="opts o-st"></div>
          <h3>🎨 Cor</h3><div class="opts o-co"></div>
          <h3>☀️ Lentes</h3><div class="opts o-sun"></div>
          <div style="text-align:center;margin-top:1vmin"><button class="big-btn green photo">📸 Tirar Foto!</button></div>
        </div>
      </div>`;
    const pv = el.querySelector('.pv');
    const timers = [];

    const render = () => {
      pv.innerHTML = Art.animal(st.animal, Art.glassesG(st.style, st.color, st.sun));
      el.querySelectorAll('.o-an .opt').forEach(b => b.classList.toggle('sel', b.dataset.v === st.animal));
      el.querySelectorAll('.o-st .opt').forEach(b => b.classList.toggle('sel', b.dataset.v === st.style));
      el.querySelectorAll('.o-co .opt').forEach(b => b.classList.toggle('sel', b.dataset.v === st.color));
      el.querySelectorAll('.o-sun .opt').forEach(b => b.classList.toggle('sel', b.dataset.v === String(st.sun)));
      pv.classList.remove('wiggle'); void pv.offsetWidth; pv.classList.add('wiggle');
    };
    const addOpt = (box, v, html, fn, extra = '') => {
      const b = document.createElement('button');
      b.className = 'opt ' + extra; b.dataset.v = v; b.innerHTML = html;
      b.onclick = () => { api.sfx('pop'); fn(); render(); };
      el.querySelector(box).appendChild(b);
      return b;
    };
    Object.keys(Art.ANIMALS).forEach(k => addOpt('.o-an', k, Art.animal(k, ''), () => { st.animal = k; api.say(Art.ANIMALS[k].name); }));
    Art.STYLES.forEach(s => addOpt('.o-st', s, Art.glasses(s, '#37474f', false), () => st.style = s));
    Art.COLORS.forEach(c => { const b = addOpt('.o-co', c.c, '', () => st.color = c.c, 'col'); b.style.background = c.c; });
    addOpt('.o-sun', 'false', Art.glasses('round', '#37474f', false), () => st.sun = false);
    addOpt('.o-sun', 'true', Art.glasses('round', '#37474f', true), () => st.sun = true);

    pv.onclick = () => { api.sfx('pop'); render(); };
    el.querySelector('.photo').onclick = () => {
      api.sfx('shutter');
      const f = document.createElement('div'); f.className = 'flash'; pv.appendChild(f);
      timers.push(setTimeout(() => api.finish(3, 'Que fotografia tão gira!'), 900));
    };
    render();

    const onResize = () => el.querySelector('.dress').classList.toggle('portrait', isPortrait());
    window.addEventListener('resize', onResize);
    return () => { timers.forEach(clearTimeout); window.removeEventListener('resize', onResize); };
  },
});
