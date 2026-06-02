// Бесконечный процедурный параллакс-фон: небо-градиент, дальние холмы, кусты, земля.
window.Game = window.Game || {};

Game.Background = class Background {
  constructor() {
    this.reset();
  }

  reset() {
    // Смещения слоёв (накапливаются, берутся по модулю при отрисовке)
    this.farX = 0;
    this.midX = 0;
    this.groundX = 0;
  }

  update(dt, worldSpeed) {
    this.farX += worldSpeed * 0.2 * dt;
    this.midX += worldSpeed * 0.5 * dt;
    this.groundX += worldSpeed * dt;
  }

  render(ctx) {
    const c = Game.config;
    const W = c.WIDTH;
    const H = c.HEIGHT;
    const gy = c.GROUND_Y;

    // Небо
    const sky = ctx.createLinearGradient(0, 0, 0, gy);
    sky.addColorStop(0, '#aee1f9');
    sky.addColorStop(1, '#e8f7ff');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, gy);

    // Солнце
    ctx.fillStyle = '#fff3b0';
    ctx.beginPath();
    ctx.arc(W - 90, 70, 34, 0, Math.PI * 2);
    ctx.fill();

    // Дальние холмы (медленный слой)
    this._tiles(ctx, this.farX, 220, '#bfe3b0', (ox) => {
      ctx.beginPath();
      ctx.moveTo(ox, gy);
      ctx.quadraticCurveTo(ox + 110, gy - 90, ox + 220, gy);
      ctx.fill();
    });

    // Средние кусты (средний слой)
    this._tiles(ctx, this.midX, 160, '#88c070', (ox) => {
      ctx.beginPath();
      ctx.arc(ox + 40, gy, 34, Math.PI, 0);
      ctx.arc(ox + 80, gy, 26, Math.PI, 0);
      ctx.arc(ox + 120, gy, 38, Math.PI, 0);
      ctx.fill();
    });

    // Земля
    ctx.fillStyle = '#caa472';
    ctx.fillRect(0, gy, W, H - gy);
    ctx.fillStyle = '#9c7c50';
    ctx.fillRect(0, gy, W, 6);

    // Полоски/камешки на земле (быстрый слой — даёт ощущение скорости)
    ctx.fillStyle = '#b08d5f';
    this._tiles(ctx, this.groundX, 70, '#b08d5f', (ox) => {
      ctx.fillRect(ox, gy + 16, 22, 5);
      ctx.fillRect(ox + 38, gy + 30, 14, 4);
    });
  }

  // Рисует повторяющийся тайл шириной tileW по всей ширине, со сдвигом offset.
  _tiles(ctx, offset, tileW, fill, drawTile) {
    const W = Game.config.WIDTH;
    ctx.fillStyle = fill;
    const shift = -(offset % tileW);
    for (let ox = shift - tileW; ox < W + tileW; ox += tileW) {
      drawTile(ox);
    }
  }
};
