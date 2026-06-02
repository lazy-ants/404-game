// Раунды-уровни, счёт и таблица рекордов (топ-10 в localStorage).
window.Game = window.Game || {};

const SCORES_KEY = 'tarakozyabra_scores_v2';

Game.RoundManager = class RoundManager {
  constructor() {
    this.leaderboard = this._loadLeaderboard();
    this.reset();
  }

  reset() {
    this.score = 0;
    this.round = 1;
    this.roundFlashTimer = 0;
  }

  _loadLeaderboard() {
    try {
      const raw = localStorage.getItem(SCORES_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  get high() {
    return this.leaderboard.length ? this.leaderboard[0].score : 0;
  }

  get worldSpeed() {
    const c = Game.config;
    return c.BASE_SPEED + (this.round - 1) * c.SPEED_PER_ROUND;
  }

  addTime(dt) {
    this.score += Game.config.POINTS_PER_SEC * dt;
    this._checkRound();
  }

  addObstacle() {
    this.score += Game.config.POINTS_PER_OBSTACLE;
    this._checkRound();
  }

  addCoins(count) {
    this.score += Game.config.POINTS_PER_COIN * count;
  }

  _checkRound() {
    const target = this.round * Game.config.ROUND_LENGTH;
    if (this.score >= target) {
      this.round += 1;
      this.roundFlashTimer = 2.0;
      return true;
    }
    return false;
  }

  update(dt) {
    if (this.roundFlashTimer > 0) this.roundFlashTimer -= dt;
  }

  // Вызывается при гейм-овере: добавляет запись в таблицу, сортирует, хранит топ-10.
  finalize(characterName) {
    const s = Math.floor(this.score);
    const entry = {
      score: s,
      round: this.round,
      char: characterName || '?',
      date: new Date().toLocaleDateString(Game.i18n.lang === 'de' ? 'de-DE' : 'en-GB'),
    };
    this.leaderboard.push(entry);
    this.leaderboard.sort((a, b) => b.score - a.score);
    this.leaderboard = this.leaderboard.slice(0, 10);
    try {
      localStorage.setItem(SCORES_KEY, JSON.stringify(this.leaderboard));
    } catch (_) {}
    // Индекс свежей записи в таблице (для подсветки)
    return this.leaderboard.findIndex(
      (e) => e.score === s && e.round === this.round && e.date === entry.date
    );
  }
};
