# SkyLume 🌤️

SkyLume is a dark-themed weather dashboard built step-by-step using plain HTML, CSS, and vanilla JavaScript (ES Modules). No frameworks or external UI libraries are used.

## Features Built So Far
- **Hero Weather Card**: Real-time conditions, animated night/day banner, and 8 atmospheric metric tiles.
- **Dynamic °C / °F Unit Toggle**: Instant recalculation across current, hourly, and 5-day forecast cards.
- **Hourly Forecast Strip**: 12-hour horizontally scrollable forecast with active tile selection.
- **5-Day Forecast**: Card grid showing daily highs, lows, conditions, and precipitation probability.
- **Saved Cities Row**: Quick-access city pill chips with active selection and removal.
- **City Search with Autocomplete**: Debounced search input (300ms) with keyboard navigation (`↑`, `↓`, `Enter`, `Escape`).
- **Recent Searches**: Remembers the last 5 searched cities when clicking into the search box.
- **Safe Persistence**: LocalStorage persistence for saved cities, recent searches, last viewed city, and preferred unit.

## Project Structure
```text
skylume/
├── client/
│   ├── index.html
│   ├── css/
│   │   ├── tokens.css        # CSS variables & theme tokens
│   │   ├── base.css          # Reset & base typography
│   │   ├── layout.css        # Map panel & responsive grid
│   │   └── components.css    # Topbar, card, chips, forecast lists
│   └── js/
│       ├── main.js           # Entry point & event wiring
│       ├── config.js         # Central constants & settings
│       ├── state.js          # Shared state store
│       ├── api/              # API router & mock client
│       ├── data/             # Mock forecasts & 25 world cities
│       ├── render/           # Dedicated component renderers
│       ├── services/         # Safe localStorage service
│       └── utils/            # Temperature, debounce, and DOM helpers
├── server/                   # Backend placeholder
└── docs/                     # Documentation & design references
```

## Running Locally

Because the application uses native ES modules (`import`/`export`), open the project through a local web server rather than opening `index.html` directly as a file.

Using Python:
```bash
python -m http.server 3000
```
Then visit: [http://localhost:3000/client/](http://localhost:3000/client/)

Using Node:
```bash
npx serve client -p 3000
```
Then visit: [http://localhost:3000](http://localhost:3000)

## License
MIT
