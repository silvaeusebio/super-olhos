// ===== Núcleo: ecrãs, som, voz, configuração =====
const $ = (s, el = document) => el.querySelector(s);
const rand = (a, b) => a + Math.random() * (b - a);
const randi = (a, b) => Math.floor(rand(a, b + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const isPortrait = () => window.innerHeight > window.innerWidth;

const GAMES = [];

// ---------- Guardar configuração ----------
const DEFAULT_PRIZES = [
  { id: 'caneta', name: 'Caneta', art: 'uma', icon: '🖊️', pct: 45, color: '#42a5f5' },
  { id: 'porta', name: 'Porta-chaves', art: 'um', icon: '🔑', pct: 45, color: '#ffca28' },
  { id: 'fio', name: 'Fio para óculos', art: 'um', icon: '👓', pct: 10, color: '#ec407a' },
];
const Store = {
  cfg: null, stats: null,
  load() {
    let c = {}, s = {};
    try { c = JSON.parse(localStorage.getItem('so_cfg') || '{}'); } catch (e) {}
    try { s = JSON.parse(localStorage.getItem('so_stats') || '{}'); } catch (e) {}
    const pct = c.pct || {};
    this.cfg = {
      sound: c.sound !== false,
      voice: c.voice !== false,
      prizes: DEFAULT_PRIZES.map(p => ({ ...p, pct: typeof pct[p.id] === 'number' ? pct[p.id] : p.pct })),
    };
    this.stats = { players: s.players || 0, given: s.given || {} };
  },
  save() {
    const pct = {}; this.cfg.prizes.forEach(p => pct[p.id] = p.pct);
    try {
      localStorage.setItem('so_cfg', JSON.stringify({ sound: this.cfg.sound, voice: this.cfg.voice, pct }));
      localStorage.setItem('so_stats', JSON.stringify(this.stats));
    } catch (e) {}
  },
};

// ---------- Som (gerado, sem ficheiros) ----------
const Sfx = {
  ctx: null,
  unlock() {
    if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  },
  tone(f, dur, type = 'sine', vol = 0.18, delay = 0, slide = 0) {
    if (!Store.cfg.sound || !this.ctx) return;
    const t = this.ctx.currentTime + delay;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, f + slide), t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(this.ctx.destination); o.start(t); o.stop(t + dur + 0.02);
  },
  play(n) {
    switch (n) {
      case 'tap': this.tone(660, 0.08, 'triangle', 0.15); break;
      case 'good': this.tone(660, 0.1, 'triangle'); this.tone(990, 0.15, 'triangle', 0.18, 0.08); break;
      case 'bad': this.tone(220, 0.25, 'sawtooth', 0.1, 0, -80); break;
      case 'pop': this.tone(500, 0.12, 'square', 0.08, 0, 600); break;
      case 'flip': this.tone(420, 0.06, 'triangle', 0.12); break;
      case 'tick': this.tone(1200, 0.03, 'square', 0.06); break;
      case 'block': this.tone(300, 0.15, 'triangle', 0.15, 0, 300); break;
      case 'win': [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.25, 'triangle', 0.18, i * 0.12)); break;
      case 'fanfare': [523, 523, 659, 784, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.3, 'triangle', 0.2, i * 0.13)); break;
      case 'shutter': this.tone(1800, 0.05, 'square', 0.1); this.tone(900, 0.08, 'square', 0.1, 0.06); break;
    }
  },
};

// ---------- Voz (lê as instruções às crianças que ainda não leem) ----------
const Voice = {
  v: null,
  pickVoice() {
    if (!('speechSynthesis' in window)) return;
    const vs = speechSynthesis.getVoices();
    this.v = vs.find(v => /pt[-_]PT/i.test(v.lang)) || vs.find(v => /^pt/i.test(v.lang)) || null;
  },
  say(text) {
    if (!Store.cfg.voice || !('speechSynthesis' in window) || !text) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = this.v ? this.v.lang : 'pt-PT'; if (this.v) u.voice = this.v;
      u.rate = 0.95; u.pitch = 1.15;
      speechSynthesis.speak(u);
    } catch (e) {}
  },
  stop() { try { speechSynthesis.cancel(); } catch (e) {} },
};

// ---------- Confetes ----------
function confetti(n = 80) {
  const box = $('#confetti');
  const cols = ['#e53935', '#1e88e5', '#43a047', '#fdd835', '#fb8c00', '#8e24aa', '#ec407a', '#c9a23a'];
  for (let i = 0; i < n; i++) {
    const c = document.createElement('i');
    c.style.left = rand(0, 100) + 'vw';
    c.style.background = pick(cols);
    c.style.animationDuration = rand(1.8, 3.4) + 's';
    c.style.animationDelay = rand(0, 0.6) + 's';
    c.style.transform = `rotate(${rand(0, 360)}deg)`;
    box.appendChild(c);
    setTimeout(() => c.remove(), 4200);
  }
}

// ---------- Texto que sobe (+1, -1...) ----------
function floatText(parent, x, y, text, color = '#2e7d32') {
  const d = document.createElement('div');
  d.className = 'float'; d.textContent = text; d.style.color = color;
  d.style.left = (x - 20) + 'px'; d.style.top = (y - 20) + 'px';
  parent.appendChild(d); setTimeout(() => d.remove(), 950);
}

// ---------- Aplicação ----------
const App = {
  player: { played: 0, spun: false, stars: {} },
  game: null, cleanup: null, session: null,
  lastTouch: Date.now(),

  init() {
    Store.load();
    $('#mascot').innerHTML = Art.mascot();
    Voice.pickVoice();
    if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = () => Voice.pickVoice();

    document.addEventListener('pointerdown', () => { Sfx.unlock(); this.lastTouch = Date.now(); }, true);
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('dblclick', e => e.preventDefault());

    $('#play-btn').onclick = () => { Sfx.play('tap'); this.goHub(); Voice.say('Escolhe um jogo!'); };
    document.querySelectorAll('[data-go]').forEach(b => b.onclick = () => {
      Sfx.play('tap'); b.dataset.go === 'home' ? this.goHome() : this.goHub();
    });
    $('#say-btn').onclick = () => this.game && Voice.say(this.game.say);
    $('#fs-btn').onclick = () => {
      const d = document.documentElement;
      if (!document.fullscreenElement) (d.requestFullscreen || d.webkitRequestFullscreen || (() => {})).call(d);
      else document.exitFullscreen && document.exitFullscreen();
    };
    $('#prize-done').onclick = () => { Sfx.play('tap'); this.goHome(); };
    $('#prize-more').onclick = () => { Sfx.play('tap'); this.goHub(); };

    this.setupAdmin();
    Wheel.init();

    // Volta ao início se ninguém tocar durante 2 minutos
    setInterval(() => {
      if (!$('#home').classList.contains('active') && $('#admin').classList.contains('hidden') && Date.now() - this.lastTouch > 120000) this.goHome();
    }, 5000);

    if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
  },

  show(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === id));
  },

  stopGame() {
    if (this.session) this.session.alive = false;
    if (this.cleanup) { try { this.cleanup(); } catch (e) { console.error(e); } }
    this.cleanup = null; this.session = null;
    $('#stage').innerHTML = '';
    $('#result').classList.add('hidden');
    Voice.stop();
  },

  goHome() {
    this.stopGame();
    this.player = { played: 0, spun: false, stars: {} };
    this.show('home');
  },

  goHub() {
    this.stopGame();
    this.renderHub();
    this.show('hub');
  },

  renderHub() {
    const g = $('#hub-grid'); g.innerHTML = '';
    GAMES.forEach(game => {
      const b = document.createElement('button');
      b.className = 'tile'; b.style.background = `linear-gradient(160deg, ${game.color}, ${game.color2 || game.color})`;
      b.innerHTML = `<div class="ti">${Art.icon(game.id) || game.icon}</div><div class="tn">${game.name}</div>`;
      b.onclick = () => { Sfx.play('tap'); this.startGame(game.id); };
      g.appendChild(b);
    });
  },

  startGame(id) {
    this.stopGame();
    const game = GAMES.find(g => g.id === id);
    this.game = game;
    $('#game-title').textContent = game.name;
    this.show('game');
    const stage = $('#stage');
    const session = { alive: true };
    this.session = session;
    const api = {
      finish: (stars, msg) => { if (!session.alive) return; session.alive = false; this.finishGame(game, stars, msg); },
      alive: () => session.alive,
      sfx: (n) => Sfx.play(n),
      say: (t) => Voice.say(t),
    };
    // Espera o ecrã ter tamanho antes de começar
    requestAnimationFrame(() => {
      if (!session.alive) return;
      this.cleanup = game.start(stage, api) || null;
      Voice.say(game.say);
    });
  },

  finishGame(game, stars, msg = '') {
    stars = Math.max(1, Math.min(3, stars | 0));
    if (this.cleanup) { try { this.cleanup(); } catch (e) {} this.cleanup = null; }
    this.player.played++;
    this.player.stars[game.id] = Math.max(this.player.stars[game.id] || 0, stars);

    const titles = { 3: 'Fantástico!', 2: 'Muito bem!', 1: 'Boa!' };
    $('#res-title').textContent = titles[stars];
    $('#res-score').textContent = msg;
    $('#res-stars').innerHTML = [1, 2, 3].map(i => `<span class="${i <= stars ? '' : 'off'}" style="animation-delay:${i * 0.18}s">⭐</span>`).join('');
    $('#res-msg').textContent = 'Ganhaste uma jogada na Roda da Sorte!';
    const btns = $('#res-btns'); btns.innerHTML = '';
    const mk = (txt, cls, fn) => { const b = document.createElement('button'); b.className = 'big-btn ' + cls; b.textContent = txt; b.onclick = () => { Sfx.play('tap'); fn(); }; btns.appendChild(b); };
    mk('🎡 Rodar a Roda!', 'gold pulse', () => this.goWheel());
    $('#result').classList.remove('hidden');
    Sfx.play('win'); confetti(stars * 30);
    Voice.say(titles[stars] + ' ' + msg + ' Ganhaste uma jogada na roda da sorte!');
  },

  goWheel() {
    this.stopGame();
    this.show('wheel');
    Wheel.prepare();
    Voice.say('Toca em rodar!');
  },

  showPrize(prize) {
    this.player.spun = true;
    $('#prize-icon').textContent = prize.icon;
    $('#prize-name').textContent = `${prize.art} ${prize.name}!`;
    this.show('prize');
    Sfx.play('fanfare'); confetti(140);
    Voice.say(`Parabéns! Ganhaste ${prize.art} ${prize.name.toLowerCase()}!`);
  },

  // ---------- Painel escondido ----------
  setupAdmin() {
    const hold = $('#brand-hold');
    let t = null;
    const start = (e) => { e.preventDefault(); t = setTimeout(() => this.openAdmin(), 3000); };
    const cancel = () => { clearTimeout(t); t = null; };
    hold.addEventListener('pointerdown', start);
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => hold.addEventListener(ev, cancel));

    let resetArmed = false;
    $('#adm-reset').onclick = () => {
      if (!resetArmed) { resetArmed = true; $('#adm-reset').textContent = 'Tens a certeza? Toca outra vez'; return; }
      resetArmed = false; $('#adm-reset').textContent = 'Zerar contagens';
      Store.stats = { players: 0, given: {} }; Store.save(); this.fillAdmin();
    };
    $('#adm-close').onclick = () => {
      const inputs = document.querySelectorAll('#adm-prizes input');
      const vals = [...inputs].map(i => Math.max(0, parseFloat(i.value) || 0));
      const tot = vals.reduce((a, b) => a + b, 0);
      if (tot <= 0) { $('#adm-warn').textContent = 'Pelo menos um prémio tem de ter percentagem maior que 0.'; return; }
      Store.cfg.prizes.forEach((p, i) => p.pct = vals[i]);
      Store.cfg.sound = $('#adm-sound').checked;
      Store.cfg.voice = $('#adm-voice').checked;
      Store.save();
      resetArmed = false; $('#adm-reset').textContent = 'Zerar contagens';
      $('#admin').classList.add('hidden');
      Wheel.prepare();
    };
  },
  fillAdmin() {
    $('#adm-prizes').innerHTML = Store.cfg.prizes.map(p =>
      `<tr><td>${p.icon} ${p.name}</td><td><input type="number" min="0" max="100" step="1" value="${p.pct}"></td><td><b>${Store.stats.given[p.id] || 0}</b></td></tr>`).join('');
    $('#adm-players').textContent = Store.stats.players;
    $('#adm-sound').checked = Store.cfg.sound;
    $('#adm-voice').checked = Store.cfg.voice;
    $('#adm-warn').textContent = '';
  },
  openAdmin() {
    this.fillAdmin();
    $('#admin').classList.remove('hidden');
  },
};
