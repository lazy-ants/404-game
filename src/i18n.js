// Локализация: EN (по умолчанию) и DE (если системный язык немецкий).
window.Game = window.Game || {};

Game.i18n = (function () {
  const strings = {
    en: {
      title:           'Tarakozyabras',
      menu_subtitle:   'Endless run. Jump and duck to survive!',
      btn_start:       'Play',
      hint_menu:       'Space / ↑ — jump · ↓ — duck · P — pause',
      charselect_title:'Choose your Tarakozyabra',
      btn_play:        'Go!',
      pause_title:     'Pause',
      btn_resume:      'Continue',
      hint_pause:      'P / Esc — continue',
      gameover_title:  'Run Over',
      label_score:     'Score:',
      label_coins:     'Coins:',
      label_round:     'Round:',
      leaderboard:     'Leaderboard',
      btn_retry:       'Play Again',
      lb_empty:        'No records yet',
      lb_round:        'Round',
      hud_score:       'Score: ',
      hud_round:       'Round ',
      hud_record:      'Best: ',
      round_flash:     'Round {n}!',
      char_0:          'Krasik',
      char_1:          'Zelon',
      char_2:          'Fiolet',
    },
    de: {
      title:           'Tarakozyabren',
      menu_subtitle:   'Endloser Lauf. Spring und duck dich!',
      btn_start:       'Spielen',
      hint_menu:       'Leertaste / ↑ — springen · ↓ — ducken · P — Pause',
      charselect_title:'Wähle deine Tarakozyabra',
      btn_play:        'Los!',
      pause_title:     'Pause',
      btn_resume:      'Weiter',
      hint_pause:      'P / Esc — Weiter',
      gameover_title:  'Lauf beendet',
      label_score:     'Punkte:',
      label_coins:     'Münzen:',
      label_round:     'Runde:',
      leaderboard:     'Bestenliste',
      btn_retry:       'Nochmal',
      lb_empty:        'Noch keine Einträge',
      lb_round:        'Runde',
      hud_score:       'Punkte: ',
      hud_round:       'Runde ',
      hud_record:      'Rekord: ',
      round_flash:     'Runde {n}!',
      char_0:          'Rötchen',
      char_1:          'Grünling',
      char_2:          'Veilchen',
    },
  };

  const nav = navigator.language || navigator.userLanguage || 'en';
  const detectedLang = nav.toLowerCase().startsWith('de') ? 'de' : 'en';

  // lang — публичное свойство; t() читает this.lang, поэтому переключение через
  // Game.i18n.lang = 'de' мгновенно применяется без перезагрузки.
  return {
    lang: detectedLang,

    t(key, vars) {
      const l = this.lang;
      let s = (strings[l] && strings[l][key]) ? strings[l][key]
            : (strings.en[key] || key);
      if (vars) {
        Object.keys(vars).forEach((k) => { s = s.replace('{' + k + '}', vars[k]); });
      }
      return s;
    },

    applyDOM() {
      document.querySelectorAll('[data-i18n]').forEach((el) => {
        el.textContent = this.t(el.dataset.i18n);
      });
      document.title = this.t('title') + ' — endless runner';
    },
  };
})();
