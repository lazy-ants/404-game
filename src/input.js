// Ввод: клавиатура (прыжок/присед/пауза/старт) и тач (тап — прыжок, свайп вниз — присед).
window.Game = window.Game || {};

Game.Input = class Input {
  constructor(canvas, handlers) {
    // handlers: { onJump, onDuckStart, onDuckEnd, onPauseToggle, onConfirm }
    this.h = handlers;
    this.canvas = canvas;
    this._bindKeyboard();
    this._bindTouch(canvas);
  }

  _bindKeyboard() {
    window.addEventListener('keydown', (e) => {
      switch (e.code) {
        case 'Space':
        case 'ArrowUp':
        case 'KeyW':
          e.preventDefault();
          this.h.onJump && this.h.onJump();
          break;
        case 'ArrowDown':
        case 'KeyS':
          e.preventDefault();
          this.h.onDuckStart && this.h.onDuckStart();
          break;
        case 'KeyP':
        case 'Escape':
          this.h.onPauseToggle && this.h.onPauseToggle();
          break;
        case 'Enter':
          this.h.onConfirm && this.h.onConfirm();
          break;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        this.h.onDuckEnd && this.h.onDuckEnd();
      }
    });
  }

  _bindTouch(canvas) {
    let startY = 0;
    let startX = 0;
    let swiped = false;

    canvas.addEventListener(
      'touchstart',
      (e) => {
        e.preventDefault();
        const t = e.changedTouches[0];
        startY = t.clientY;
        startX = t.clientX;
        swiped = false;
      },
      { passive: false }
    );

    canvas.addEventListener(
      'touchmove',
      (e) => {
        const t = e.changedTouches[0];
        if (!swiped && t.clientY - startY > 40 && Math.abs(t.clientX - startX) < 60) {
          swiped = true;
          this.h.onDuckStart && this.h.onDuckStart();
        }
      },
      { passive: false }
    );

    canvas.addEventListener(
      'touchend',
      (e) => {
        e.preventDefault();
        if (swiped) {
          this.h.onDuckEnd && this.h.onDuckEnd();
        } else {
          // Короткий тап — прыжок (он же подтверждение на экранах меню)
          this.h.onJump && this.h.onJump();
          this.h.onConfirm && this.h.onConfirm();
        }
      },
      { passive: false }
    );
  }
};
