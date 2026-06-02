// Пресеты героев-«таракозябр» и их процедурная отрисовка из примитивов.
window.Game = window.Game || {};

// Каждый пресет описывает внешность существа. Рисуем овал-тело, лапки (анимируются
// по кадру бега), усики и глаза. Никаких файлов-картинок — всё кодом.
// Имена берутся из i18n (char_0, char_1, char_2), поле name — геттер.
Game.characters = [
  {
    id: 'krasik',
    get name() { return Game.i18n.t('char_0'); },
    body: '#e94f37',
    belly: '#ffb4a2',
    leg: '#7a1f12',
    eye: '#1d1d1d',
    legs: 6,
    bodyW: 1.0,
    bodyH: 1.0,
  },
  {
    id: 'zelyon',
    get name() { return Game.i18n.t('char_1'); },
    body: '#3bb273',
    belly: '#c7f9cc',
    leg: '#1b4d3e',
    eye: '#1d1d1d',
    legs: 8,
    bodyW: 1.15,
    bodyH: 0.85,
  },
  {
    id: 'fiolet',
    get name() { return Game.i18n.t('char_2'); },
    body: '#7b5ea7',
    belly: '#d8c2f3',
    leg: '#3d2c5a',
    eye: '#1d1d1d',
    legs: 6,
    bodyW: 0.9,
    bodyH: 1.1,
  },
];

// Отрисовка существа в прямоугольнике (x, y — левый верх; w, h — габариты хитбокса).
// pose: 'run' | 'jump' | 'duck'. frame — растущий счётчик кадров для анимации лап.
Game.drawCreature = function (ctx, preset, x, y, w, h, pose, frame) {
  ctx.save();
  ctx.translate(x, y);

  const cx = w / 2;
  const cy = h / 2;
  const bw = (w / 2) * preset.bodyW;
  const bh = (h / 2) * preset.bodyH;

  // Лапки (рисуем до тела, чтобы тело перекрывало их основания)
  ctx.strokeStyle = preset.leg;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  const legPairs = Math.max(2, Math.floor(preset.legs / 2));
  const swing = pose === 'run' ? Math.sin(frame * 0.5) * 5 : 0;
  for (let i = 0; i < legPairs; i++) {
    const t = legPairs === 1 ? 0.5 : i / (legPairs - 1);
    const lx = cx + (t - 0.5) * bw * 1.4;
    const phase = i % 2 === 0 ? swing : -swing;
    const footY = pose === 'duck' ? h - 2 : h + 4;
    ctx.beginPath();
    ctx.moveTo(lx, cy + bh * 0.4);
    ctx.lineTo(lx - 6 + phase, footY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(lx, cy + bh * 0.4);
    ctx.lineTo(lx + 6 - phase, footY);
    ctx.stroke();
  }

  // Тело
  ctx.fillStyle = preset.body;
  ctx.beginPath();
  ctx.ellipse(cx, cy, bw, bh, 0, 0, Math.PI * 2);
  ctx.fill();

  // Брюшко (светлая нижняя часть)
  ctx.fillStyle = preset.belly;
  ctx.beginPath();
  ctx.ellipse(cx, cy + bh * 0.35, bw * 0.7, bh * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();

  // Голова (справа — направление бега)
  const hx = cx + bw * 0.75;
  const hy = cy - bh * 0.15;
  const hr = bh * 0.55;
  ctx.fillStyle = preset.body;
  ctx.beginPath();
  ctx.arc(hx, hy, hr, 0, Math.PI * 2);
  ctx.fill();

  // Усики
  ctx.strokeStyle = preset.leg;
  ctx.lineWidth = 2;
  const antWobble = Math.sin(frame * 0.3) * 3;
  ctx.beginPath();
  ctx.moveTo(hx + hr * 0.3, hy - hr * 0.6);
  ctx.quadraticCurveTo(hx + hr * 1.4, hy - hr * 1.6, hx + hr * 2.0 + antWobble, hy - hr * 1.2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(hx + hr * 0.3, hy - hr * 0.3);
  ctx.quadraticCurveTo(hx + hr * 1.5, hy - hr * 0.4, hx + hr * 2.2 - antWobble, hy + hr * 0.1);
  ctx.stroke();

  // Глаз
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(hx + hr * 0.3, hy - hr * 0.1, hr * 0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = preset.eye;
  ctx.beginPath();
  ctx.arc(hx + hr * 0.45, hy - hr * 0.1, hr * 0.22, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};
