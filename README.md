# Tarakozyabras — Endless Runner

An HTML5 endless runner game built with vanilla JS and Canvas API. No dependencies, no build step — just open `index.html` and play.

![Game preview](https://raw.githubusercontent.com/lazy-ants/404-game/master/preview.png)

## What is this game?

You control one of three procedurally drawn creatures called **Tarakozyabras**. They run automatically through an infinite side-scrolling world. Your job:

- **Jump** over ground obstacles (rocks, cacti)
- **Duck** under overhead hazards (flying bugs)
- **Collect coins** for bonus points
- Survive as long as possible — difficulty increases with each **round**

Every round the world speeds up and obstacles come more frequently. Your score and a top-10 leaderboard are saved locally in the browser.

## Controls

| Action | Keyboard | Touch |
|--------|----------|-------|
| Jump | `Space` / `↑` / `W` | Tap |
| Duck | `↓` / `S` | Swipe down |
| Pause | `P` / `Esc` | — |
| Confirm / Restart | `Enter` | Tap |

## Features

- 3 selectable heroes with unique looks and animations
- Procedural graphics — all drawn in code, no image files
- Procedural sound effects via Web Audio API
- Parallax scrolling background
- Round-based difficulty scaling
- Top-10 leaderboard stored in `localStorage`
- EN / DE localisation (auto-detected from browser language)
- Works offline, zero dependencies

## How to add to your website

### Option 1 — Inline iframe

Drop the game into any page with a single `<iframe>`:

```html
<iframe
  src="https://your-domain.com/404-game/index.html"
  width="900"
  height="360"
  style="border:none; max-width:100%;"
  allowfullscreen
></iframe>
```

### Option 2 — Host the files yourself

1. Copy the entire repository into a folder on your server:
   ```
   /your-site/
   └── 404-game/
       ├── index.html
       ├── style.css
       └── src/
   ```
2. Link to it or embed it however you like. No server-side setup required — it is a static site.

### Option 3 — 404 page

Use the game as a fun 404 error page. In most web servers you can point the 404 handler at `index.html`:

**Nginx**
```nginx
error_page 404 /404-game/index.html;
```

**Apache `.htaccess`**
```apache
ErrorDocument 404 /404-game/index.html
```

**Next.js** — rename / copy to `pages/404.tsx` or use a redirect in `next.config.js`.

### Customising

All game constants (speed, gravity, round length, score values) live in [`src/config.js`](src/config.js). Edit that file to re-balance the game without touching any logic.

## Development

No build step required. Open `index.html` directly in a browser, or serve with any static server:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## License

MIT License — see [LICENSE](LICENSE).

## Credits

© 2024 [Lazy Ants](https://lazy-ants.de). Built with ❤️ and vanilla JS.
