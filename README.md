# GALE

Minimalist weather TUI powered by [Open-Meteo](https://open-meteo.com/). Zero API keys, zero tracking.

```
                          ~ GALE ~
                         ◇ weather ◇

                   › search for a city...

               type · ↑↓ navigate · enter select
```

## Features

- **No API keys or signup required**: Direct queries to Open-Meteo.
- **Terminal UI**: Fast, keyboard-driven navigation built with Ink.
- **Local Web Dashboard**: Obsidian black UI at `http://localhost:3000`.
- **Forecast data**:
  - Current conditions: temperature, apparent temperature, humidity, wind speed and direction, UV index, barometric pressure.
  - 6-hour hourly forecast with precipitation probability.
  - 7-day outlook with daily highs, lows, and rain forecast.

## Quick Install

### One-line installer (macOS / Linux)

```bash
curl -fsSL https://raw.githubusercontent.com/carbonthecoder/GALE/main/website/public/install.sh | bash
```

### From source

```bash
git clone https://github.com/carbonthecoder/GALE.git
cd GALE
npm install
npm run build
```

Link globally:

```bash
npm link
gale
```

## Usage

### Terminal Interface

```bash
npm start
# or directly after building:
node dist/cli.mjs
```

| Key | Action |
|---|---|
| Type characters | Search for a city |
| `↑` `↓` | Navigate search results |
| `Enter` | Select city |
| `Esc` | Clear search query |
| `b` / `q` | Back to search / quit |

### Local Web Interface

Launch the KINO-style obsidian black dashboard at `http://localhost:3000`:

```bash
npm run web
# or via flag:
node dist/cli.mjs --web
```

## Development

```bash
npm run build      # Bundle CLI with esbuild
npm run dev        # Build and run CLI
npm run web        # Run local web dashboard
npm run website:dev   # Start Next.js landing page dev server
npm run website:build # Build Next.js landing page
```

## Data Sources

- Geocoding: [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
- Weather Forecast: [Open-Meteo Weather Forecast API](https://open-meteo.com/en/docs)

## License

MIT © [carbonthecoder](https://github.com/carbonthecoder)
