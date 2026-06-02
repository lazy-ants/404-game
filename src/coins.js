// Монетки: появляются группами, собираются столкновением, дают очки.
window.Game = window.Game || {};

Game.Coin = class Coin {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 10;
    this.collected = false;
    this.animT = Math.random() * Math.PI * 2; // смещение анимации блеска
  }

  update(dt, worldSpeed) {
    this.x -= worldSpeed * dt;
    this.animT += dt * 4;
  }

  get offscreen() {
    return this.x + this.r < 0;
  }

  get hitbox() {
    return { x: this.x - this.r, y: this.y - this.r, w: this.r * 2, h: this.r * 2 };
  }

  render(ctx) {
    if (this.collected) return;
    ctx.save();
    // Мигание блеска
    const shine = 0.7 + Math.sin(this.animT) * 0.3;
    ctx.fillStyle = `rgba(255, 215, 0, ${shine})`;
    ctx.strokeStyle = '#b8860b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Звёздочка внутри
    ctx.fillStyle = `rgba(255, 255, 180, ${shine * 0.9})`;
    ctx.beginPath();
    ctx.arc(this.x - 2, this.y - 2, this.r * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
};

// Спавнер монеток: выпускает группы по 3–5 штук на разных высотах.
Game.CoinSpawner = class CoinSpawner {
  constructor() {
    this.reset();
  }

  reset() {
    this.coins = [];
    this.timer = 2.5 + Math.random() * 2;
  }

  update(dt, worldSpeed, round) {
    this.timer -= dt;
    if (this.timer <= 0) {
      this._spawnGroup(worldSpeed);
      const interval = Math.max(1.8, 3.5 - round * 0.1);
      this.timer = interval * (0.8 + Math.random() * 0.4);
    }
    for (const c of this.coins) c.update(dt, worldSpeed);
    this.coins = this.coins.filter((c) => !c.offscreen);
  }

  _spawnGroup(worldSpeed) {
    const c = Game.config;
    const count = 3 + Math.floor(Math.random() * 3); // 3–5 монеток
    const startX = c.WIDTH + 20;

    // Случайный тип группы: линия на земле, дуга в воздухе, горизонтальная на высоте прыжка
    const type = Math.random();
    for (let i = 0; i < count; i++) {
      let x, y;
      if (type < 0.4) {
        // Горизонтальная линия у земли
        x = startX + i * 30;
        y = c.GROUND_Y - 20;
      } else if (type < 0.7) {
        // Дуга: надо прыгнуть чтобы собрать
        x = startX + i * 28;
        y = c.GROUND_Y - 80 - Math.sin((i / (count - 1)) * Math.PI) * 70;
      } else {
        // Горизонталь на средней высоте
        x = startX + i * 30;
        y = c.GROUND_Y - 110;
      }
      this.coins.push(new Game.Coin(x, y));
    }
  }

  // Возвращает кол-во собранных монеток (для звука/очков). Мутирует состояние.
  collectWith(playerHitbox) {
    let count = 0;
    for (const c of this.coins) {
      if (!c.collected && aabbOverlap(playerHitbox, c.hitbox)) {
        c.collected = true;
        count++;
      }
    }
    return count;
  }

  render(ctx) {
    for (const c of this.coins) c.render(ctx);
  }
};

function aabbOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
