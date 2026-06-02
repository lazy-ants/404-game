// Игрок: физика прыжка/приседа, состояния и хитбокс.
window.Game = window.Game || {};

Game.Player = class Player {
  constructor(presetIndex = 0) {
    this.presetIndex = presetIndex;
    this.reset();
  }

  reset() {
    const c = Game.config;
    this.w = c.PLAYER_W;
    this.h = c.PLAYER_H;
    this.x = c.PLAYER_X;
    this.y = c.GROUND_Y - this.h; // верхняя координата (стоит на земле)
    this.vy = 0;
    this.onGround = true;
    this.ducking = false;
    this.frame = 0;
  }

  get preset() {
    return Game.characters[this.presetIndex];
  }

  jump() {
    if (this.onGround) {
      this.vy = Game.config.JUMP_VELOCITY;
      this.onGround = false;
      this.ducking = false;
    }
  }

  // Удержание приседа имеет смысл только на земле
  setDuck(active) {
    this.ducking = active && this.onGround;
  }

  get state() {
    if (!this.onGround) return 'jump';
    if (this.ducking) return 'duck';
    return 'run';
  }

  // Текущий хитбокс с учётом прыжка и приседа.
  // В приседе на земле — низкий бокс, привязанный к земле (проходит под верхними).
  // Иначе — бокс на фактической вертикальной позиции this.y (учитывает прыжок).
  get hitbox() {
    const c = Game.config;
    if (this.ducking && this.onGround) {
      return { x: this.x, y: c.GROUND_Y - c.DUCK_H, w: this.w, h: c.DUCK_H };
    }
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }

  update(dt) {
    const c = Game.config;
    this.vy += c.GRAVITY * dt;
    this.y += this.vy * dt;

    const floor = c.GROUND_Y - this.h;
    if (this.y >= floor) {
      this.y = floor;
      this.vy = 0;
      this.onGround = true;
    }

    if (this.state === 'run') this.frame += dt * 60;
  }

  render(ctx) {
    const hb = this.hitbox;
    Game.drawCreature(ctx, this.preset, hb.x, hb.y, hb.w, hb.h, this.state, this.frame);
  }
};
