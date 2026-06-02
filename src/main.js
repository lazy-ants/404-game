// Точка входа: game loop, конечный автомат состояний и связка всех модулей.
window.Game = window.Game || {};

(function () {
  const C = Game.config;
  const S = Game.STATE;

  let canvas, ctx;
  let state = S.MENU;
  let lastTime = 0;
  let selectedChar = 0;
  let coinsTotal = 0;

  let player, spawner, coinSpawner, background, rounds;

  function init() {
    canvas = document.getElementById('game');
    canvas.width = C.WIDTH;
    canvas.height = C.HEIGHT;
    ctx = canvas.getContext('2d');

    background = new Game.Background();
    rounds = new Game.RoundManager();
    spawner = new Game.Spawner();
    coinSpawner = new Game.CoinSpawner();
    player = new Game.Player(selectedChar);

    new Game.Input(canvas, {
      onJump: handleJump,
      onDuckStart: () => state === S.PLAYING && player.setDuck(true),
      onDuckEnd: () => player && player.setDuck(false),
      onPauseToggle: togglePause,
      onConfirm: handleConfirm,
    });

    Game.i18n.applyDOM();
    // Вставляем путь логотипа в <svg> из единого источника Game.LOGO_PATH
    const logoSvg = document.getElementById('brand-logo-svg');
    if (logoSvg) {
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', Game.LOGO_PATH);
      logoSvg.appendChild(p);
    }
    buildCharSelect();
    bindButtons();
    setState(S.MENU);

    requestAnimationFrame(loop);
  }

  // --- Управление состояниями ---

  function setState(next) {
    state = next;
    Game.UI.hideAll();
    if (state === S.MENU) Game.UI.show('menu');
    else if (state === S.CHARSELECT) Game.UI.show('charselect');
    else if (state === S.PAUSED) Game.UI.show('pause');
    else if (state === S.GAMEOVER) Game.UI.show('gameover');
  }

  function startGame() {
    player = new Game.Player(selectedChar);
    spawner.reset();
    coinSpawner.reset();
    background.reset();
    rounds.reset();
    coinsTotal = 0;
    setState(S.PLAYING);
  }

  function gameOver() {
    Game.Sound.gameOver();
    const charName = Game.characters[selectedChar].name;
    const hi = rounds.finalize(charName);
    document.getElementById('final-score').textContent = Math.floor(rounds.score);
    document.getElementById('final-round').textContent = rounds.round;
    document.getElementById('final-coins').textContent = coinsTotal;
    Game.UI.fillLeaderboard(rounds.leaderboard, hi);
    setState(S.GAMEOVER);
  }

  function togglePause() {
    if (state === S.PLAYING) setState(S.PAUSED);
    else if (state === S.PAUSED) setState(S.PLAYING);
  }

  // --- Обработчики ввода ---

  function handleJump() {
    if (state === S.PLAYING) {
      const jumped = player.onGround;
      player.jump();
      if (jumped) Game.Sound.jump();
    }
  }


  function handleConfirm() {
    if (state === S.MENU) setState(S.CHARSELECT);
    else if (state === S.GAMEOVER) setState(S.CHARSELECT);
  }

  // --- Игровой цикл ---

  function loop(t) {
    const dt = Math.min((t - lastTime) / 1000 || 0, 0.05);
    lastTime = t;

    if (state === S.PLAYING) update(dt);
    render();

    requestAnimationFrame(loop);
  }

  function update(dt) {
    const speed = rounds.worldSpeed;
    const prevRound = rounds.round;

    background.update(dt, speed);
    player.update(dt);
    spawner.update(dt, speed, rounds.round);
    coinSpawner.update(dt, speed, rounds.round);
    rounds.update(dt);
    rounds.addTime(dt);

    // Монетки
    const collected = coinSpawner.collectWith(player.hitbox);
    if (collected > 0) {
      coinsTotal += collected;
      rounds.addCoins(collected);
      Game.Sound.coin();
    }

    // Бонус за пройденные препятствия
    for (const o of spawner.obstacles) {
      if (!o.passed && o.x + o.w < player.x) {
        o.passed = true;
        rounds.addObstacle();
      }
    }

    // Звук смены раунда
    if (rounds.round > prevRound) {
      Game.Sound.roundUp();
    }

    // Столкновения с препятствиями (AABB)
    const hb = player.hitbox;
    for (const o of spawner.obstacles) {
      if (aabb(hb, o.hitbox)) {
        gameOver();
        return;
      }
    }
  }

  function render() {
    background.render(ctx);

    if (state === S.PLAYING || state === S.PAUSED || state === S.GAMEOVER) {
      coinSpawner.render(ctx);
      spawner.render(ctx);
      player.render(ctx);
      Game.UI.drawHUD(ctx, rounds, coinsTotal);
    }
  }

  function aabb(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  // --- Экран выбора героя ---

  function buildCharSelect() {
    const wrap = document.getElementById('char-list');
    wrap.innerHTML = '';
    Game.characters.forEach((preset, i) => {
      const card = document.createElement('button');
      card.className = 'char-card' + (i === selectedChar ? ' selected' : '');
      card.dataset.index = i;

      const prev = document.createElement('canvas');
      prev.width = 90;
      prev.height = 80;
      const pctx = prev.getContext('2d');
      Game.drawCreature(pctx, preset, 12, 16, 64, 52, 'run', 0);

      const label = document.createElement('div');
      label.textContent = preset.name;
      label.className = 'char-name';

      card.appendChild(prev);
      card.appendChild(label);
      card.addEventListener('click', () => {
        selectedChar = i;
        document.querySelectorAll('.char-card').forEach((c) => c.classList.remove('selected'));
        card.classList.add('selected');
      });
      wrap.appendChild(card);
    });
  }

  function bindButtons() {
    document.getElementById('btn-start').addEventListener('click', () => setState(S.CHARSELECT));
    document.getElementById('btn-play').addEventListener('click', startGame);
    document.getElementById('btn-resume').addEventListener('click', () => setState(S.PLAYING));
    document.getElementById('btn-retry').addEventListener('click', () => setState(S.CHARSELECT));
  }

  window.addEventListener('DOMContentLoaded', init);
})();
