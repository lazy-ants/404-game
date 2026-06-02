// Отрисовка HUD на канвасе и вспомогательные функции для экранных оверлеев.
window.Game = window.Game || {};

Game.UI = {
  drawHUD(ctx, rounds, coinsTotal) {
    const c = Game.config;
    const T = Game.i18n.t.bind(Game.i18n);
    ctx.save();
    ctx.fillStyle = '#2d2a26';
    ctx.font = 'bold 20px Segoe UI, Arial, sans-serif';
    ctx.textBaseline = 'top';

    ctx.textAlign = 'left';
    ctx.fillText(T('hud_score') + Math.floor(rounds.score), 16, 14);

    ctx.textAlign = 'center';
    ctx.fillText(T('hud_round') + rounds.round, c.WIDTH / 2, 14);

    // Монетки — рисуем кружок вручную (эмодзи на Canvas ненадёжны)
    const coinX = c.WIDTH - 16;
    const coinY = 23;
    ctx.textAlign = 'right';
    ctx.font = 'bold 18px Segoe UI, Arial, sans-serif';
    ctx.fillStyle = '#e6c619';
    ctx.fillText(coinsTotal, coinX - 18, 14);
    ctx.beginPath();
    ctx.arc(coinX - 6, coinY, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd700';
    ctx.fill();
    ctx.strokeStyle = '#b8860b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.textAlign = 'right';
    ctx.font = '14px Segoe UI, Arial, sans-serif';
    ctx.fillStyle = '#5c574f';
    ctx.fillText(T('hud_record') + rounds.high, coinX - 32, 14);

    // Баннер смены раунда
    if (rounds.roundFlashTimer > 0) {
      const alpha = Math.min(1, rounds.roundFlashTimer);
      ctx.globalAlpha = alpha;
      ctx.font = 'bold 48px Segoe UI, Arial, sans-serif';
      ctx.textAlign = 'center';

      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillText(T('round_flash', { n: rounds.round }), c.WIDTH / 2 + 3, c.HEIGHT / 2 - 57);

      ctx.fillStyle = '#e94f37';
      ctx.fillText(T('round_flash', { n: rounds.round }), c.WIDTH / 2, c.HEIGHT / 2 - 60);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  },

  // Заполняет таблицу рекордов в DOM-элементе #leaderboard-list
  fillLeaderboard(entries, highlightIndex) {
    const list = document.getElementById('leaderboard-list');
    if (!list) return;
    const T = Game.i18n.t.bind(Game.i18n);
    list.innerHTML = '';
    if (!entries.length) {
      list.innerHTML = `<li class="lb-empty">${T('lb_empty')}</li>`;
      return;
    }
    entries.forEach((e, i) => {
      const li = document.createElement('li');
      li.className = 'lb-row' + (i === highlightIndex ? ' lb-highlight' : '');
      li.innerHTML =
        `<span class="lb-rank">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1) + '.'}</span>` +
        `<span class="lb-score">${e.score}</span>` +
        `<span class="lb-detail">${e.char} · ${T('lb_round')} ${e.round} · ${e.date}</span>`;
      list.appendChild(li);
    });
  },

  show(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
  },

  hide(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  },

  hideAll() {
    document.querySelectorAll('.overlay').forEach((el) => el.classList.add('hidden'));
  },
};
