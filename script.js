'use strict';

/* ============================================
   NÍVEL MÉDIO 1: frases rotativas (estilo Patrick Jane)
   ============================================ */
const frases = [
  'Eu já sabia que você ia abrir esse link.',
  'Observação: 20 anos, gosta de vinho e de rock. Conclusão: gente fina.',
  'Dedução simples: hoje é o seu dia, e o mundo tem que saber.',
  'Tem um presente te esperando. Percebi pela sua curiosidade.',
  'Última pista: está escrito 20 em tudo, até no meu coração. 😉'
];

const elFrase = document.getElementById('frase');
let indiceFrase = 0;

// ÂNCORA: esmaece o texto, troca a frase e faz aparecer de novo
function mostrarFrase() {
  elFrase.classList.add('some');
  setTimeout(() => {
    elFrase.textContent = frases[indiceFrase];
    elFrase.classList.remove('some');
    indiceFrase = (indiceFrase + 1) % frases.length; // volta ao início no fim da lista
  }, 600);
}

mostrarFrase();
setInterval(mostrarFrase, 4500);

/* ============================================
   NÍVEL MÉDIO 2: fotos que ainda não existem
   ============================================ */
// ÂNCORA: se a foto falhar ao carregar, troca a imagem por um espaço com ícone
document.querySelectorAll('.polaroid img').forEach((img) => {
  img.addEventListener('error', () => {
    const vazio = document.createElement('div');
    vazio.className = 'vazio';
    vazio.textContent = '📷';
    img.replaceWith(vazio);
  });
});

// ÂNCORA: ao dar play num vídeo, pausa os outros vídeos e a música (nada de som duplicado)
const videos = document.querySelectorAll('.cartao-video video');
videos.forEach((video) => {
  video.addEventListener('play', () => {
    videos.forEach((outro) => { if (outro !== video) outro.pause(); });
    document.getElementById('musica').pause();
  });
});

// Se não houver música, esconde a seção inteira para não ficar um player quebrado
const musica = document.getElementById('musica');
musica.addEventListener('error', () => {
  document.getElementById('rock').dataset.semMusica = 'true';
});

/* ============================================
   NÍVEL DIFÍCIL 1: confete em canvas
   ============================================ */
const canvas = document.getElementById('confete');
const ctx = canvas.getContext('2d');
const cores = ['#e0b872', '#a3203f', '#f8eddc', '#7b1530', '#f3d9a4', '#ffffff'];
let particulas = [];
let rodando = false;

// ÂNCORA: o canvas precisa acompanhar o tamanho real da tela
function ajustarCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
ajustarCanvas();
window.addEventListener('resize', ajustarCanvas);

// Cria um pedacinho de confete com posição, velocidade e giro aleatórios
function criarParticula(x, y, explosao) {
  const angulo = Math.random() * Math.PI * 2;
  const forca = explosao ? 4 + Math.random() * 9 : 0.5 + Math.random();
  return {
    x, y,
    vx: explosao ? Math.cos(angulo) * forca : (Math.random() - 0.5) * 1.5,
    vy: explosao ? Math.sin(angulo) * forca - 5 : forca + 1,
    largura: 6 + Math.random() * 8,
    altura: 4 + Math.random() * 6,
    rotacao: Math.random() * Math.PI,
    giro: (Math.random() - 0.5) * 0.3,
    cor: cores[Math.floor(Math.random() * cores.length)],
    vida: 1
  };
}

// ÂNCORA: requestAnimationFrame só roda enquanto houver confete na tela
function animar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particulas.forEach((p) => {
    p.vy += 0.12;          // gravidade puxa para baixo
    p.vx *= 0.99;          // resistência do ar
    p.x += p.vx;
    p.y += p.vy;
    p.rotacao += p.giro;
    p.vida -= 0.004;       // vai sumindo aos poucos

    ctx.save();
    ctx.globalAlpha = Math.max(p.vida, 0);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotacao);
    ctx.fillStyle = p.cor;
    ctx.fillRect(-p.largura / 2, -p.altura / 2, p.largura, p.altura);
    ctx.restore();
  });

  // Remove o que já saiu da tela ou desapareceu (evita travar o celular)
  particulas = particulas.filter((p) => p.vida > 0 && p.y < canvas.height + 20);

  if (particulas.length > 0) {
    requestAnimationFrame(animar);
  } else {
    rodando = false;
  }
}

function iniciarLoop() {
  if (!rodando) {
    rodando = true;
    requestAnimationFrame(animar);
  }
}

// Explosão a partir de um ponto (usada ao abrir o presente)
function explodirConfete(qtd, x, y) {
  for (let i = 0; i < qtd; i++) particulas.push(criarParticula(x, y, true));
  iniciarLoop();
}

// Chuva suave vinda do topo
function chuvaDeConfete(qtd) {
  for (let i = 0; i < qtd; i++) {
    particulas.push(criarParticula(Math.random() * canvas.width, -10 - Math.random() * 200, false));
  }
  iniciarLoop();
}

// Chuvinha leve ao carregar a página
chuvaDeConfete(40);

/* ============================================
   NÍVEL DIFÍCIL 2: abrir o presente
   ============================================ */
const btn = document.getElementById('btnPresente');
const revelaveis = document.querySelectorAll('.secao.oculta');

btn.addEventListener('click', () => {
  const caixa = btn.getBoundingClientRect();
  const x = caixa.left + caixa.width / 2;
  const y = caixa.top + caixa.height / 2;

  // Explosão grande de confete + chuva em seguida
  explodirConfete(260, x, y);
  setTimeout(() => chuvaDeConfete(120), 600);

  // ÂNCORA: tira a classe .oculta e aplica .revelada (que dispara a animação)
  revelaveis.forEach((secao, i) => {
    setTimeout(() => {
      secao.classList.remove('oculta');
      secao.classList.add('revelada');
    }, i * 500);
  });

  btn.classList.add('aberto');
  btn.querySelector('.texto').textContent = 'Presente aberto! 🎉';
  btn.querySelector('.icone').textContent = '🍷';

  // Rola suavemente até a carta
  setTimeout(() => {
    document.getElementById('carta').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 700);
}, { once: true }); // só dispara uma vez

/* ============================================
   NÍVEL MÉDIO 3: contagem regressiva até 00:00 do dia 25
   ============================================ */
// ÂNCORA: o "-04:00" fixa o horário de Porto Velho; assim o alvo não muda com o fuso do celular
const alvo = new Date('2026-10-25T00:00:00-04:00').getTime();
const elContagem = document.getElementById('contagem');
const jaPassouAoAbrir = Date.now() >= alvo; // a página já abriu depois da meia-noite?
let confeteDoGrandeDia = false;

// Garante 2 dígitos (5 vira "05")
const doisDigitos = (n) => String(n).padStart(2, '0');

function atualizarContagem() {
  const falta = alvo - Date.now(); // milissegundos que ainda faltam

  if (falta <= 0) {
    // Chegou o grande dia: troca os números por uma mensagem e para o relógio
    elContagem.innerHTML = '<p class="hoje">🎉 Hoje é o seu dia! 🎉</p>';
    clearInterval(cronometro);
    // Se a meia-noite chegou com a página aberta, comemora com confete
    if (!jaPassouAoAbrir && !confeteDoGrandeDia) {
      confeteDoGrandeDia = true;
      explodirConfete(220, window.innerWidth / 2, window.innerHeight / 3);
    }
    return;
  }

  // ÂNCORA: converte para segundos e "quebra" em dias, horas, minutos e segundos
  const totalSeg = Math.floor(falta / 1000);
  const dias = Math.floor(totalSeg / 86400);
  const horas = Math.floor((totalSeg % 86400) / 3600);
  const minutos = Math.floor((totalSeg % 3600) / 60);
  const segundos = totalSeg % 60;

  const partes = [
    [dias, 'dias'],
    [doisDigitos(horas), 'horas'],
    [doisDigitos(minutos), 'min'],
    [doisDigitos(segundos), 'seg']
  ];

  elContagem.innerHTML = partes
    .map(([valor, rotulo]) => `<div class="tempo"><strong>${valor}</strong><span>${rotulo}</span></div>`)
    .join('');
}

const cronometro = setInterval(atualizarContagem, 1000);
atualizarContagem(); // mostra já na abertura, sem esperar 1 segundo
