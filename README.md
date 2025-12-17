# Ultimate Tic Tac Toe

A colorful, browser-based take on Ultimate Tic Tac Toe where each move sends your opponent to the matching micro board. Built with vanilla HTML/CSS/JS—no build step required.

[Live Demo](https://ttk.github.io/ultimate-tictactoe/).

## Quick start
- Open `index.html` directly in a modern browser; everything is static.
- Optional: serve locally for cleaner CSP/caching behavior (e.g. `python -m http.server 8000` then visit http://localhost:8000).

## How to play
- Standard Tic Tac Toe rules inside each micro board (3×3), but you must play in the target board that matches your opponent’s last cell.
- If that target board is already won or drawn, you may play in any open board.
- Win a micro board to claim its spot on the macro board. First to win three in a row on the macro board takes the game. If all boards close without a macro win, it’s a draw.

## Controls & UI
- Click a highlighted cell to place your mark.
- Status bar shows whose turn it is, the required target board, and any invalid-move messages.
- “Restart Game” resets everything.

## Project structure
- `index.html` — page shell with status bar, board container, and controls.
- `styles.css` — playful neon-on-navy theme, responsive layout, hover/active states, and board overlays.
- `script.js` — game state, legality checks, win detection, rendering, and interactions.
- `favicon.svg` — simple icon for the page.

## Tech notes
- Vanilla JS manages state: board arrays, allowed moves, win/draw evaluation for micro and macro boards.
- No external dependencies; runs offline.
- Designed to be responsive down to mobile widths.

## Development tips
- Edit the static files and refresh—no bundler needed.
- For tweaks, start in `styles.css` for look and `script.js` for rules/logic.

