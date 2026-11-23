// ===== Quiz da Visão (adultos) =====
// Em cada pergunta, a PRIMEIRA resposta é a certa (são baralhadas no jogo).
const QUIZ_BANK = [
  ['Como se chama a parte colorida do olho?', ['Íris', 'Pupila', 'Córnea', 'Retina'],
    'A íris é um músculo que abre e fecha a pupila para controlar a luz que entra.'],
  ['Quem tem miopia vê mal...', ['Ao longe', 'Ao perto', 'Só à noite', 'As cores'],
    'Na miopia, os objetos distantes ficam desfocados. Corrige-se com lentes divergentes.'],
  ['A presbiopia ("vista cansada") começa normalmente por volta dos...', ['40–45 anos', '20 anos', '65 anos', '10 anos'],
    'Com a idade o cristalino perde flexibilidade e torna-se difícil focar ao perto.'],
  ['Que tipo de lente corrige a miopia?', ['Divergente (côncava)', 'Convergente (convexa)', 'Lente de aumento', 'Lente polarizada'],
    'As lentes divergentes afastam o ponto de foco para que a imagem caia na retina.'],
  ['O astigmatismo deve-se, na maioria dos casos, a...', ['Uma córnea com curvatura irregular', 'Falta de vitaminas', 'Excesso de luz', 'Ler deitado'],
    'A córnea mais "oval" do que redonda faz com que a imagem fique distorcida a todas as distâncias.'],
  ['Na regra 20-20-20 para quem usa ecrãs, de quanto em quanto tempo se deve fazer uma pausa?', ['20 minutos', '2 horas', '20 segundos', '1 hora'],
    'A cada 20 minutos, olhe para algo a cerca de 6 metros (20 pés) durante 20 segundos.'],
  ['Quantas vezes, em média, pestanejamos por minuto?', ['Cerca de 15 a 20', '2 a 3', 'Mais de 100', 'Nenhuma, só quando há pó'],
    'Em frente a ecrãs pestanejamos muito menos, e por isso os olhos ficam secos.'],
  ['Em que parte do olho se forma a imagem?', ['Retina', 'Cristalino', 'Íris', 'Pálpebra'],
    'A retina tem as células sensíveis à luz (cones e bastonetes) que enviam a imagem ao cérebro.'],
  ['O que são as cataratas?', ['O cristalino ficar opaco', 'Uma inflamação da pálpebra', 'Lágrimas a mais', 'Uma alergia ao pólen'],
    'O cristalino torna-se baço e a visão fica turva. Trata-se com uma cirurgia simples.'],
  ['O glaucoma está muitas vezes associado a...', ['Pressão elevada dentro do olho', 'Falta de sono', 'Uso de lentes de contacto', 'Ler com pouca luz'],
    'A pressão danifica o nervo ótico aos poucos e sem dor. Por isso os exames regulares são importantes.'],
  ['O daltonismo é mais frequente em...', ['Homens', 'Mulheres', 'É igual nos dois', 'Só em crianças'],
    'Afeta cerca de 8% dos homens e menos de 1% das mulheres, porque está ligado ao cromossoma X.'],
  ['O mais importante nuns óculos de sol é...', ['Terem proteção UV (UV400)', 'Serem muito escuros', 'Serem espelhados', 'Serem grandes'],
    'Uma lente escura sem filtro UV pode ser pior: a pupila abre e entra mais radiação.'],
  ['"Olho preguiçoso" é o nome popular de...', ['Ambliopia', 'Conjuntivite', 'Miopia', 'Cataratas'],
    'É um olho que não desenvolveu boa visão. Trata-se melhor se for detetado cedo, na infância.'],
  ['Até que idade, aproximadamente, o olho preguiçoso tem melhor tratamento?', ['Até aos 7–8 anos', 'Até aos 30 anos', 'Em qualquer idade é igual', 'Só depois dos 18'],
    'O sistema visual desenvolve-se na infância. Por isso o rastreio das crianças é tão importante.'],
  ['Que alimento é famoso por ter beta-caroteno (vitamina A), boa para a visão?', ['Cenoura', 'Batata frita', 'Chocolate', 'Arroz'],
    'A vitamina A ajuda a retina, sobretudo na visão com pouca luz.'],
  ['Para limpar as lentes de contacto deve usar...', ['Solução própria para lentes', 'Água da torneira', 'Saliva', 'Álcool'],
    'A água da torneira pode ter microrganismos que causam infeções graves no olho.'],
  ['Qual é a "janela" transparente na frente do olho?', ['Córnea', 'Esclera', 'Pupila', 'Retina'],
    'A córnea é transparente e faz a maior parte da focagem da luz.'],
  ['A pupila fica maior quando...', ['Há pouca luz', 'Há muita luz', 'Olhamos para perto', 'Comemos'],
    'Com pouca luz a pupila dilata para deixar entrar mais luz.'],
  ['Mesmo sem queixas, um adulto deve fazer um exame à visão de quanto em quanto tempo?', ['1 a 2 anos', '10 anos', 'Só quando doer', 'Nunca'],
    'Muitos problemas, como o glaucoma, não dão sintomas no início.'],
  ['O que é a "mancha cega" do olho?', ['O ponto onde sai o nervo ótico', 'Uma doença grave', 'Uma sujidade na córnea', 'A sombra do nariz'],
    'Nesse ponto não há células para ver. O cérebro "preenche" a falha e nem damos por ela.'],
  ['Como vê um bebé recém-nascido?', ['Desfocado, melhor a 20–30 cm', 'Tão bem como um adulto', 'Ao contrário', 'Não vê nada'],
    'A visão desenvolve-se nos primeiros meses. Ao início vê melhor à distância de um colo.'],
  ['Ler com pouca luz estraga a vista para sempre?', ['Não, apenas cansa os olhos', 'Sim, sempre', 'Só nas crianças', 'Só a ler no telemóvel'],
    'É um mito: cansa e pode dar dor de cabeça, mas não causa danos permanentes.'],
  ['Usar óculos faz a vista piorar?', ['Não, é um mito', 'Sim, os olhos ficam preguiçosos', 'Só se forem de sol', 'Só ao fim de 10 anos'],
    'Os óculos não alteram o olho. A graduação pode mudar com a idade, com ou sem óculos.'],
  ['Para que servem as lentes progressivas?', ['Ver ao longe, a meia distância e ao perto', 'Só para o sol', 'Só para o computador', 'Só para crianças'],
    'A graduação muda gradualmente ao longo da lente, sem a "linha" das bifocais.'],
  ['Os raios UV podem fazer mal aos olhos em dias nublados?', ['Sim', 'Não', 'Só no verão', 'Só na praia'],
    'Grande parte da radiação UV atravessa as nuvens. A neve e a água também a refletem.'],
  ['Que parte do olho muda de forma para focar ao perto e ao longe?', ['Cristalino', 'Íris', 'Córnea', 'Pálpebra'],
    'O cristalino é uma lente natural flexível, controlada por pequenos músculos.'],
  ['Para que servem as lágrimas?', ['Lubrificar, limpar e proteger o olho', 'Só para chorar', 'Para ver as cores', 'Para focar'],
    'A lágrima tem água, óleos e substâncias que combatem as bactérias.'],
  ['Quem tem hipermetropia tem mais dificuldade em ver...', ['Ao perto', 'Ao longe', 'As cores', 'À noite'],
    'Na hipermetropia o olho esforça-se para focar, sobretudo ao perto. Pode dar cansaço e dores de cabeça.'],
  ['Quantas cores consegue o olho humano distinguir, aproximadamente?', ['Cerca de 1 milhão', 'Cerca de 100', 'Só 7, as do arco-íris', '1000'],
    'Com três tipos de cones (vermelho, verde e azul) distinguimos cerca de um milhão de tons.'],
  ['Qual é o músculo mais rápido do corpo humano?', ['O que fecha a pálpebra', 'O coração', 'O da língua', 'O bíceps'],
    'Um piscar de olhos demora apenas cerca de 100 a 150 milésimos de segundo.'],
];

GAMES.push({
  id: 'quiz', group: 'adultos', name: 'Quiz da Visão', icon: '❓', color: '#26a69a', color2: '#00695c',
  say: 'Responde a dez perguntas sobre a visão. Tens vinte segundos para cada uma!',
  start(el, api) {
    const N = 10, TIME = 20;
    const qs = shuffle(QUIZ_BANK).slice(0, N);
    let i = 0, right = 0, timer = null, left = TIME, answered = false;
    el.style.background = 'linear-gradient(160deg,#e0f2f1,#fff7e0)';
    el.innerHTML = `<div class="quiz">
      <div class="quiz-top"><span class="quiz-n"></span><span class="quiz-ok">✅ 0</span></div>
      <div class="quiz-bar"><i></i></div>
      <h3 class="quiz-q"></h3>
      <div class="quiz-opts"></div>
      <div class="quiz-exp hidden"></div>
      <button class="big-btn blue quiz-next hidden">Seguinte ➜</button>
    </div>`;
    const nEl = el.querySelector('.quiz-n'), okEl = el.querySelector('.quiz-ok'), bar = el.querySelector('.quiz-bar i');
    const qEl = el.querySelector('.quiz-q'), oEl = el.querySelector('.quiz-opts'), xEl = el.querySelector('.quiz-exp'), next = el.querySelector('.quiz-next');

    function show() {
      const [q, opts, exp] = qs[i];
      answered = false; left = TIME;
      nEl.textContent = `Pergunta ${i + 1} de ${N}`;
      qEl.textContent = q;
      xEl.classList.add('hidden'); next.classList.add('hidden');
      oEl.innerHTML = '';
      shuffle(opts.map((t, k) => ({ t, ok: k === 0 }))).forEach((o, k) => {
        const b = document.createElement('button');
        b.className = 'quiz-opt'; b.innerHTML = `<b>${'ABCD'[k]}</b><span></span>`; b.querySelector('span').textContent = o.t;
        b.dataset.ok = o.ok ? '1' : '';
        b.onclick = () => answer(b);
        oEl.appendChild(b);
      });
      bar.style.transition = 'none'; bar.style.width = '100%'; bar.style.background = '';
      clearInterval(timer);
      timer = setInterval(() => {
        left -= 0.1;
        bar.style.width = Math.max(0, left / TIME * 100) + '%';
        if (left <= 5) bar.style.background = '#e53935';
        if (left <= 0) answer(null);
      }, 100);
      xEl.dataset.exp = exp;
    }

    function answer(btn) {
      if (answered || !api.alive()) return;
      answered = true; clearInterval(timer);
      const ok = btn && btn.dataset.ok;
      oEl.querySelectorAll('.quiz-opt').forEach(b => {
        b.disabled = true;
        if (b.dataset.ok) b.classList.add('right');
        else if (b === btn) b.classList.add('wrong');
      });
      if (ok) { right++; okEl.textContent = `✅ ${right}`; api.sfx('good'); }
      else api.sfx('bad');
      xEl.innerHTML = `<b>${ok ? 'Certo!' : btn ? 'Errado.' : 'Acabou o tempo!'}</b> `;
      xEl.appendChild(document.createTextNode(xEl.dataset.exp));
      xEl.className = 'quiz-exp ' + (ok ? 'good' : 'bad');
      next.textContent = i + 1 < N ? 'Seguinte ➜' : 'Ver resultado ➜';
      next.classList.remove('hidden');
    }

    next.onclick = () => {
      api.sfx('tap');
      i++;
      if (i < N) show();
      else api.finish(right >= 8 ? 3 : right >= 5 ? 2 : 1, `Acertaste ${right} de ${N} perguntas!`);
    };

    show();
    return () => { clearInterval(timer); el.style.background = ''; };
  },
});
