// Препятствия: наземные (перепрыгнуть) и верхние (пригнуться), + спавнер.
window.Game = window.Game || {};

// Одно препятствие. type: 'ground' (камень/кактус) | 'top' (летящая помеха).
Game.Obstacle = class Obstacle {
  constructor(type) {
    const c = Game.config;
    this.type = type;
    this.passed = false; // засчитан ли бонус за прохождение

    if (type === 'ground') {
      this.w = 30 + Math.random() * 26;
      this.h = 34 + Math.random() * 30;
      this.x = c.WIDTH + this.w;
      this.y = c.GROUND_Y - this.h;
    } else {
      // Верхнее препятствие висит так, что пройти можно только в приседе.
      this.w = 46 + Math.random() * 24;
      this.h = 26;
      this.x = c.WIDTH + this.w;
      this.y = c.GROUND_Y - c.PLAYER_H - 6; // нижний край ниже роста стоящего героя
    }
  }

  update(dt, worldSpeed) {
    this.x -= worldSpeed * dt;
  }

  get offscreen() {
    return this.x + this.w < 0;
  }

  get hitbox() {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }

  render(ctx) {
    if (this.type === 'ground') {
      // Кактус-камень
      ctx.fillStyle = '#3b7d4f';
      this._roundRect(ctx, this.x, this.y, this.w, this.h, 6);
      ctx.fill();
      ctx.fillStyle = '#2f6440';
      ctx.fillRect(this.x + this.w * 0.4, this.y + 6, this.w * 0.2, this.h - 10);
    } else {
      // Летящая помеха (тёмное "облако-жук")
      ctx.fillStyle = '#5b4b8a';
      this._roundRect(ctx, this.x, this.y, this.w, this.h, 10);
      ctx.fill();
      // Крылышки
      ctx.fillStyle = '#7c6bb0';
      ctx.beginPath();
      ctx.ellipse(this.x + this.w * 0.3, this.y + 4, 10, 5, 0, 0, Math.PI * 2);
      ctx.ellipse(this.x + this.w * 0.7, this.y + 4, 10, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
};

// Управляет списком препятствий и таймером спавна. Окно спавна сужается с раундом.
Game.Spawner = class Spawner {
  constructor() {
    this.reset();
  }

  reset() {
    this.obstacles = [];
    this.timer = this._nextDelay(1);
  }

  _nextDelay(round) {
    const c = Game.config;
    const tighten = Math.min((round - 1) * c.SPAWN_TIGHTEN, c.SPAWN_MAX - c.SPAWN_FLOOR);
    const min = Math.max(c.SPAWN_MIN - tighten, c.SPAWN_FLOOR);
    const max = Math.max(c.SPAWN_MAX - tighten, min + 0.2);
    return min + Math.random() * (max - min);
  }

  update(dt, worldSpeed, round) {
    this.timer -= dt;
    if (this.timer <= 0) {
      // Верхние препятствия появляются чаще на поздних раундах, но не сразу
      const topChance = round >= 2 ? 0.35 : 0.0;
      const type = Math.random() < topChance ? 'top' : 'ground';
      this.obstacles.push(new Game.Obstacle(type));
      this.timer = this._nextDelay(round);
    }

    for (const o of this.obstacles) o.update(dt, worldSpeed);
    this.obstacles = this.obstacles.filter((o) => !o.offscreen);
  }

  render(ctx) {
    for (const o of this.obstacles) o.render(ctx);
  }
};
