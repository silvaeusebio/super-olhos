// ===== Desenhos SVG (óculos, animais, mascote, criança) =====
const Art = (() => {
  const COLORS = [
    { n: 'vermelho', c: '#e53935' },
    { n: 'azul', c: '#1e88e5' },
    { n: 'verde', c: '#43a047' },
    { n: 'amarelo', c: '#fdd835' },
    { n: 'laranja', c: '#fb8c00' },
    { n: 'roxo', c: '#8e24aa' },
    { n: 'rosa', c: '#ec407a' },
    { n: 'preto', c: '#263238' },
  ];
  const STYLES = ['round', 'square', 'cat', 'heart', 'star', 'aviator'];

  function starPts(cx, cy, ro, ri) {
    const p = [];
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? ri : ro;
      const a = -Math.PI / 2 + i * Math.PI / 5;
      p.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1));
    }
    return p.join(' ');
  }

  // Uma lente centrada em (cx,cy). mirror = lente direita (espelhada)
  function lens(style, cx, cy, mirror, attrs) {
    const m = mirror ? ` transform="translate(${2 * cx},0) scale(-1,1)"` : '';
    switch (style) {
      case 'round': return `<circle cx="${cx}" cy="${cy}" r="32" ${attrs}/>`;
      case 'square': return `<rect x="${cx - 37}" y="${cy - 27}" width="74" height="54" rx="10" ${attrs}/>`;
      case 'cat': return `<path${m} d="M${cx - 36},${cy - 12} Q${cx - 32},${cy - 32} ${cx + 40},${cy - 32} Q${cx + 36},${cy + 26} ${cx},${cy + 26} Q${cx - 36},${cy + 24} ${cx - 36},${cy - 12}Z" ${attrs}/>`;
      case 'heart': return `<path d="M${cx},${cy + 30} C${cx - 52},${cy} ${cx - 30},${cy - 42} ${cx},${cy - 16} C${cx + 30},${cy - 42} ${cx + 52},${cy} ${cx},${cy + 30}Z" ${attrs}/>`;
      case 'star': return `<polygon points="${starPts(cx, cy + 3, 40, 19)}" ${attrs}/>`;
      case 'aviator': return `<path${m} d="M${cx - 36},${cy - 22} Q${cx},${cy - 30} ${cx + 36},${cy - 22} Q${cx + 38},${cy + 6} ${cx + 14},${cy + 28} Q${cx - 30},${cy + 34} ${cx - 36},${cy - 22}Z" ${attrs}/>`;
    }
    return '';
  }

  // Grupo de óculos numa caixa 200x80 (lentes em x=55 e x=145, y=40)
  function glassesG(style, color, sun) {
    const fill = sun ? 'fill="#1a1a2e" fill-opacity="0.88"' : 'fill="#bfe3ff" fill-opacity="0.35"';
    const a = `${fill} stroke="${color}" stroke-width="8" stroke-linejoin="round"`;
    const shine = `<path d="M40,28 q8,-8 18,-6" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.8"/>` +
      `<path d="M130,28 q8,-8 18,-6" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.8"/>`;
    return `<g>
      <path d="M19,32 L3,26" stroke="${color}" stroke-width="8" stroke-linecap="round"/>
      <path d="M181,32 L197,26" stroke="${color}" stroke-width="8" stroke-linecap="round"/>
      <path d="M86,36 Q100,24 114,36" stroke="${color}" stroke-width="8" fill="none" stroke-linecap="round"/>
      ${lens(style, 55, 40, false, a)}${lens(style, 145, 40, true, a)}${shine}
    </g>`;
  }

  function glasses(style, color, sun) {
    return `<svg viewBox="-6 -10 212 100" xmlns="http://www.w3.org/2000/svg">${glassesG(style, color, sun)}</svg>`;
  }

  function glassesDataURL(style, color, sun) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(glasses(style, color, sun));
  }

  // ---------- Animais (300x300, olhos em 105,140 e 195,140) ----------
  const eyes = (c = '#222') => `
    <circle cx="105" cy="140" r="13" fill="${c}"/><circle cx="195" cy="140" r="13" fill="${c}"/>
    <circle cx="110" cy="135" r="4" fill="#fff"/><circle cx="200" cy="135" r="4" fill="#fff"/>`;
  const cheeks = `<ellipse cx="75" cy="195" rx="18" ry="11" fill="#ff8a80" opacity=".5"/><ellipse cx="225" cy="195" rx="18" ry="11" fill="#ff8a80" opacity=".5"/>`;

  const ANIMALS = {
    gato: { name: 'Gato', draw: () => `
      <polygon points="45,120 70,18 145,72" fill="#ffa94d"/><polygon points="255,120 230,18 155,72" fill="#ffa94d"/>
      <polygon points="65,100 78,45 120,75" fill="#ffc9de"/><polygon points="235,100 222,45 180,75" fill="#ffc9de"/>
      <ellipse cx="150" cy="168" rx="122" ry="108" fill="#ffa94d"/>
      <path d="M130,62 q20,25 40,0" stroke="#f08c2e" stroke-width="8" fill="none"/>
      ${eyes()}${cheeks}
      <polygon points="138,180 162,180 150,194" fill="#ff6b9a"/>
      <path d="M150,194 q-14,18 -28,6 M150,194 q14,18 28,6" stroke="#333" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M95,190 L30,180 M95,200 L32,210 M205,190 L270,180 M205,200 L268,210" stroke="#333" stroke-width="3" stroke-linecap="round"/>` },
    cao: { name: 'Cão', draw: () => `
      <ellipse cx="45" cy="150" rx="38" ry="80" fill="#7b4a2a" transform="rotate(18 45 150)"/>
      <ellipse cx="255" cy="150" rx="38" ry="80" fill="#7b4a2a" transform="rotate(-18 255 150)"/>
      <ellipse cx="150" cy="160" rx="112" ry="112" fill="#c68642"/>
      <ellipse cx="195" cy="125" rx="36" ry="30" fill="#a86b33"/>
      ${eyes()}
      <ellipse cx="150" cy="210" rx="55" ry="40" fill="#f0d2a8"/>
      <ellipse cx="150" cy="192" rx="20" ry="14" fill="#222"/>
      <path d="M150,205 v12 M150,217 q-16,12 -30,0 M150,217 q16,12 30,0" stroke="#222" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M140,226 q10,26 20,0" fill="#ff6b81"/>` },
    urso: { name: 'Urso', draw: () => `
      <circle cx="60" cy="70" r="42" fill="#8d5a3b"/><circle cx="240" cy="70" r="42" fill="#8d5a3b"/>
      <circle cx="60" cy="70" r="22" fill="#d7a77a"/><circle cx="240" cy="70" r="22" fill="#d7a77a"/>
      <ellipse cx="150" cy="165" rx="125" ry="112" fill="#8d5a3b"/>
      ${eyes()}${cheeks}
      <ellipse cx="150" cy="210" rx="52" ry="40" fill="#d7a77a"/>
      <ellipse cx="150" cy="192" rx="18" ry="12" fill="#3b2314"/>
      <path d="M150,204 v10 M150,214 q-14,12 -26,0 M150,214 q14,12 26,0" stroke="#3b2314" stroke-width="4" fill="none" stroke-linecap="round"/>` },
    porco: { name: 'Porco', draw: () => `
      <polygon points="50,110 55,30 125,72" fill="#f78fb3"/><polygon points="250,110 245,30 175,72" fill="#f78fb3"/>
      <ellipse cx="150" cy="165" rx="125" ry="110" fill="#f8a5c2"/>
      ${eyes()}
      <ellipse cx="150" cy="205" rx="48" ry="34" fill="#f78fb3" stroke="#e7709a" stroke-width="4"/>
      <ellipse cx="134" cy="205" rx="8" ry="12" fill="#c2185b"/><ellipse cx="166" cy="205" rx="8" ry="12" fill="#c2185b"/>
      <path d="M125,250 q25,14 50,0" stroke="#c2185b" stroke-width="4" fill="none" stroke-linecap="round"/>` },
    panda: { name: 'Panda', draw: () => `
      <circle cx="62" cy="68" r="40" fill="#222"/><circle cx="238" cy="68" r="40" fill="#222"/>
      <ellipse cx="150" cy="165" rx="125" ry="112" fill="#fafafa" stroke="#ddd" stroke-width="3"/>
      <ellipse cx="102" cy="148" rx="30" ry="38" fill="#222" transform="rotate(30 102 148)"/>
      <ellipse cx="198" cy="148" rx="30" ry="38" fill="#222" transform="rotate(-30 198 148)"/>
      ${eyes('#fff').replace(/r="4" fill="#fff"/g, 'r="4" fill="#222"')}
      ${cheeks}
      <ellipse cx="150" cy="195" rx="16" ry="11" fill="#222"/>
      <path d="M150,205 v10 M150,215 q-14,12 -26,0 M150,215 q14,12 26,0" stroke="#222" stroke-width="4" fill="none" stroke-linecap="round"/>` },
    coelho: { name: 'Coelho', draw: () => `
      <ellipse cx="105" cy="50" rx="26" ry="72" fill="#eceff1" transform="rotate(-10 105 50)"/>
      <ellipse cx="195" cy="50" rx="26" ry="72" fill="#eceff1" transform="rotate(10 195 50)"/>
      <ellipse cx="105" cy="55" rx="12" ry="52" fill="#ffc9de" transform="rotate(-10 105 55)"/>
      <ellipse cx="195" cy="55" rx="12" ry="52" fill="#ffc9de" transform="rotate(10 195 55)"/>
      <ellipse cx="150" cy="175" rx="115" ry="102" fill="#eceff1"/>
      ${eyes()}${cheeks}
      <ellipse cx="150" cy="190" rx="12" ry="9" fill="#ff6b9a"/>
      <path d="M150,199 v8 M150,207 q-12,12 -24,2 M150,207 q12,12 24,2" stroke="#555" stroke-width="4" fill="none" stroke-linecap="round"/>
      <rect x="138" y="214" width="11" height="14" rx="2" fill="#fff" stroke="#ccc"/><rect x="151" y="214" width="11" height="14" rx="2" fill="#fff" stroke="#ccc"/>` },
  };

  function animal(kind, gG) {
    const a = ANIMALS[kind] || ANIMALS.gato;
    const g = gG ? `<g transform="translate(50,100)">${gG}</g>` : '';
    return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">${a.draw()}${g}</svg>`;
  }

  // ---------- Mascote: uns óculos com olhos ----------
  function mascot() {
    return `<svg viewBox="0 0 240 170" xmlns="http://www.w3.org/2000/svg">
      <path d="M22,60 L4,48" stroke="#1e88e5" stroke-width="10" stroke-linecap="round"/>
      <path d="M218,60 L236,48" stroke="#1e88e5" stroke-width="10" stroke-linecap="round"/>
      <path d="M100,64 Q120,46 140,64" stroke="#1e88e5" stroke-width="10" fill="none" stroke-linecap="round"/>
      <circle cx="62" cy="72" r="44" fill="#fff" stroke="#1e88e5" stroke-width="11"/>
      <circle cx="178" cy="72" r="44" fill="#fff" stroke="#1e88e5" stroke-width="11"/>
      <g class="pupils"><circle cx="70" cy="76" r="17" fill="#263238"/><circle cx="186" cy="76" r="17" fill="#263238"/>
      <circle cx="76" cy="69" r="6" fill="#fff"/><circle cx="192" cy="69" r="6" fill="#fff"/></g>
      <ellipse cx="36" cy="112" rx="12" ry="7" fill="#ff8a80" opacity=".7"/><ellipse cx="204" cy="112" rx="12" ry="7" fill="#ff8a80" opacity=".7"/>
      <path d="M92,128 Q120,158 148,128" stroke="#263238" stroke-width="8" fill="#ff7043" stroke-linecap="round"/>
    </svg>`;
  }

  // ---------- Criança (para "Protege os Olhos") ----------
  function kid(ouch, shades) {
    const eyesOpen = `<circle cx="105" cy="140" r="12" fill="#263238"/><circle cx="195" cy="140" r="12" fill="#263238"/>
      <circle cx="109" cy="136" r="4" fill="#fff"/><circle cx="199" cy="136" r="4" fill="#fff"/>`;
    const eyesShut = `<path d="M88,132 L120,145 L88,152 M212,132 L180,145 L212,152" stroke="#263238" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    const mouth = ouch
      ? `<ellipse cx="150" cy="218" rx="18" ry="22" fill="#b71c1c"/>`
      : `<path d="M115,205 Q150,240 185,205" stroke="#6d2b1a" stroke-width="7" fill="#fff" stroke-linecap="round"/>`;
    return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="150" cy="80" rx="125" ry="70" fill="#5d4037"/>
      <circle cx="30" cy="160" r="26" fill="#f5c9a0"/><circle cx="270" cy="160" r="26" fill="#f5c9a0"/>
      <ellipse cx="150" cy="160" rx="118" ry="122" fill="#f9d7b5"/>
      <path d="M40,110 Q90,40 150,70 Q210,40 260,110 Q240,60 150,45 Q60,60 40,110Z" fill="#5d4037"/>
      ${ouch && !shades ? eyesShut : eyesOpen}
      <ellipse cx="80" cy="185" rx="20" ry="12" fill="#ff8a80" opacity=".55"/><ellipse cx="220" cy="185" rx="20" ry="12" fill="#ff8a80" opacity=".55"/>
      <path d="M150,160 q-10,18 4,22" stroke="#d9a47a" stroke-width="5" fill="none" stroke-linecap="round"/>
      ${mouth}
      ${shades ? `<g transform="translate(50,100)">${glassesG('aviator', '#263238', true)}</g>` : ''}
    </svg>`;
  }

  // ---------- Letra E (olho de águia), aponta para a direita ----------
  function letterE(color = '#111') {
    return `<svg viewBox="0 0 5 5" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" fill="${color}">
      <rect x="0" y="0" width="5" height="1"/><rect x="0" y="2" width="5" height="1"/>
      <rect x="0" y="4" width="5" height="1"/><rect x="0" y="0" width="1" height="5"/></svg>`;
  }

  // ---------- Ícones do menu (200x200, num círculo branco) ----------
  const wrap = (inner) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="96" fill="#fff" opacity=".95"/><circle cx="100" cy="100" r="96" fill="none" stroke="#14213d" stroke-opacity=".12" stroke-width="6"/>${inner}</svg>`;
  const gAt = (x, y, s, rot, style, color, sun) =>
    `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s}) translate(-100,-40)">${glassesG(style, color, sun)}</g>`;

  const ICONS = {
    apanha: () => wrap(`
      ${gAt(70, 48, 0.42, -18, 'round', '#e53935')}
      ${gAt(138, 70, 0.38, 14, 'star', '#8e24aa')}
      <path d="M58,62 l0,10 M142,40 l0,10" stroke="#90caf9" stroke-width="5" stroke-linecap="round"/>
      <path d="M38,108 H162 L148,172 Q146,180 138,180 H62 Q54,180 52,172Z" fill="#d7a35a" stroke="#8d5a2b" stroke-width="6" stroke-linejoin="round"/>
      <path d="M50,128 H150 M54,150 H146 M80,110 L84,178 M120,110 L116,178" stroke="#8d5a2b" stroke-width="5" opacity=".6"/>
      <path d="M60,108 Q100,60 140,108" fill="none" stroke="#8d5a2b" stroke-width="7" stroke-linecap="round"/>
      ${gAt(100, 104, 0.4, 0, 'square', '#1e88e5')}`),
    memoria: () => wrap(`
      <g transform="rotate(-12 70 105)"><rect x="30" y="50" width="78" height="108" rx="12" fill="#14213d" stroke="#c9a23a" stroke-width="6"/>
        <ellipse cx="69" cy="104" rx="22" ry="14" fill="#fff"/><circle cx="69" cy="104" r="9" fill="#c9a23a"/></g>
      <g transform="rotate(10 130 105)"><rect x="92" y="46" width="78" height="108" rx="12" fill="#fff" stroke="#ab47bc" stroke-width="6"/>
        ${gAt(131, 100, 0.33, 0, 'heart', '#ec407a')}</g>`),
    veste: () => `<svg viewBox="-20 -20 340 340" xmlns="http://www.w3.org/2000/svg"><circle cx="150" cy="150" r="164" fill="#fff" opacity=".95"/>
      ${ANIMALS.gato.draw()}<g transform="translate(50,100)">${glassesG('star', '#e53935', false)}</g></svg>`,
    aguia: () => {
      const e = (x, y, s, r) => `<g transform="translate(${x},${y}) rotate(${r}) scale(${s}) translate(-2.5,-2.5)"><rect x="0" y="0" width="5" height="1"/><rect x="0" y="2" width="5" height="1"/><rect x="0" y="4" width="5" height="1"/><rect x="0" y="0" width="1" height="5"/></g>`;
      return wrap(`<rect x="48" y="30" width="104" height="140" rx="10" fill="#f5f5f5" stroke="#26a69a" stroke-width="6"/>
        <g fill="#14213d">${e(100, 66, 9, 0)}${e(78, 112, 5, 90)}${e(122, 112, 5, 270)}${e(74, 146, 3, 180)}${e(100, 146, 3, 0)}${e(126, 146, 3, 90)}</g>
        <circle cx="152" cy="150" r="26" fill="none" stroke="#ff7043" stroke-width="8"/><path d="M170,168 L188,186" stroke="#ff7043" stroke-width="10" stroke-linecap="round"/>`);
    },
    protege: () => wrap(`
      <g transform="translate(22,40) scale(0.5)">${kid(false, true).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>
      <circle cx="156" cy="46" r="18" fill="#ffca28" stroke="#fff" stroke-width="4"/>
      <g stroke="#ffb300" stroke-width="5" stroke-linecap="round">${[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
        const r1 = 27, r2 = 38, c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180);
        return `<line x1="${156 + c * r1}" y1="${46 + s * r1}" x2="${156 + c * r2}" y2="${46 + s * r2}"/>`; }).join('')}</g>
      `),
    cores: () => wrap(`
      <circle cx="52" cy="58" r="17" fill="#e53935"/><circle cx="92" cy="40" r="17" fill="#fdd835"/><circle cx="135" cy="44" r="17" fill="#43a047"/>
      <circle cx="160" cy="80" r="15" fill="#1e88e5"/><circle cx="40" cy="98" r="15" fill="#8e24aa"/>
      <g transform="translate(100,128) scale(0.72) translate(-100,-40)">
        <path d="M19,32 L3,26 M181,32 L197,26" stroke="#14213d" stroke-width="8" stroke-linecap="round"/>
        <path d="M86,36 Q100,24 114,36" stroke="#14213d" stroke-width="8" fill="none" stroke-linecap="round"/>
        <circle cx="55" cy="40" r="32" fill="#ec407a" stroke="#14213d" stroke-width="8"/>
        <circle cx="145" cy="40" r="32" fill="#29b6f6" stroke="#14213d" stroke-width="8"/>
        <path d="M40,28 q8,-8 18,-6 M130,28 q8,-8 18,-6" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/></g>`),
    diferencas: () => wrap(`
      <rect x="22" y="48" width="74" height="74" rx="10" fill="#bbdefb" stroke="#43a047" stroke-width="5"/>
      <rect x="104" y="48" width="74" height="74" rx="10" fill="#bbdefb" stroke="#43a047" stroke-width="5"/>
      <path d="M22,100 Q59,86 96,100 V112 Q96,122 86,122 H32 Q22,122 22,112Z M104,100 Q141,86 178,100 V112 Q178,122 168,122 H114 Q104,122 104,112Z" fill="#8bc34a"/>
      <circle cx="46" cy="72" r="11" fill="#fdd835"/><circle cx="72" cy="92" r="9" fill="#e53935"/>
      <circle cx="128" cy="72" r="11" fill="#fdd835"/><circle cx="154" cy="92" r="9" fill="#1e88e5"/>
      <circle cx="140" cy="138" r="30" fill="#fff" fill-opacity=".45" stroke="#14213d" stroke-width="8"/>
      <path d="M161,159 L182,180" stroke="#14213d" stroke-width="13" stroke-linecap="round"/>`),
  };
  const icon = (id) => (ICONS[id] ? ICONS[id]() : '');

  return { COLORS, STYLES, ANIMALS, glasses, glassesG, glassesDataURL, animal, mascot, kid, letterE, icon };
})();
