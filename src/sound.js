// Процедурные звуки через Web Audio API — никаких файлов.
// AudioContext создаётся при первом взаимодействии (требование браузеров).
window.Game = window.Game || {};

Game.Sound = (function () {
  let ctx = null;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // Простой осциллятор с огибающей громкости
  function tone(freq, type, duration, startVol, endVol, startTime) {
    const c = getCtx();
    const t = startTime || c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = type || 'square';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(startVol, t);
    gain.gain.linearRampToValueAtTime(endVol, t + duration);
    osc.start(t);
    osc.stop(t + duration + 0.005);
  }

  return {
    jump() {
      const c = getCtx();
      const t = c.currentTime;
      tone(220, 'square', 0.08, 0.18, 0, t);
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain); gain.connect(c.destination);
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.linearRampToValueAtTime(440, t + 0.1);
      osc.type = 'square';
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.12);
      osc.start(t); osc.stop(t + 0.13);
    },

    coin() {
      const c = getCtx();
      const t = c.currentTime;
      tone(880, 'sine', 0.04, 0.22, 0.18, t);
      tone(1320, 'sine', 0.06, 0.18, 0, t + 0.03);
    },

    gameOver() {
      const c = getCtx();
      const t = c.currentTime;
      tone(330, 'sawtooth', 0.12, 0.2, 0.1, t);
      tone(220, 'sawtooth', 0.15, 0.2, 0.05, t + 0.12);
      tone(110, 'sawtooth', 0.25, 0.2, 0, t + 0.28);
    },

    roundUp() {
      const c = getCtx();
      const t = c.currentTime;
      [523, 659, 784, 1047].forEach((f, i) => {
        tone(f, 'square', 0.1, 0.15, 0.05, t + i * 0.09);
      });
    },
  };
})();
