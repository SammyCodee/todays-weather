# Today's Weather

A small React + TypeScript app that shows today's weather for any city using the
[OpenWeather Current Weather API](https://openweathermap.org/current), and keeps a
search history you can re-run or delete. It has light and dark themes and works from
small phones up to desktop screens.

UI behaviour decisions are listed in [ASSUMPTIONS.md](ASSUMPTIONS.md).

## Features

- Search by **city**, by **city + country**, or by **country** alone. The country can
  be a name ("Malaysia", "South Korea") or an ISO code ("MY", "KR").
- Shows the temperature, the high/low, the condition and description, humidity, the
  location and the time of the search.
- **Search history**: newest first, saved in `localStorage`. Each row can search
  again (🔍) or be deleted (🗑).
- **Clear error messages** for an empty city, an unknown country, a city that isn't
  found, a bad API key, rate limits and network problems.
- **Light / dark theme switcher**. It follows the OS preference on first visit and
  remembers your choice.
- **Responsive**: a mobile-first layout that switches to the desktop mockup layout at
  640px.
- **Accessible**: semantic landmarks and headings, labelled inputs and icon buttons,
  `role="alert"` errors, visible keyboard focus, 44px touch targets, and support for
  `prefers-reduced-motion`.

## How to open the app

### 1. What you need

- **Node.js 18 or newer.** Check with `node -v`. If you don't have it, install the LTS
  version from [nodejs.org](https://nodejs.org/).
- **Git**, to download the code.
- **A free OpenWeather API key:**
  1. Sign up at [openweathermap.org](https://home.openweathermap.org/users/sign_up).
  2. Open [API keys](https://home.openweathermap.org/api_keys) and copy your key.
  3. A brand-new key can take **up to 2 hours** to start working. Until then, searches
     show an "API key" error.

### 2. Download the code

```bash
git clone https://github.com/SammyCodee/todays-weather.git
cd todays-weather
```

### 3. Install the dependencies

```bash
npm install
```

### 4. Add your API key

Copy the example settings file:

```bash
cp .env.example .env.local
```

Open `.env.local` in any text editor and replace `your_api_key_here` with your key:

```
VITE_OPENWEATHER_API_KEY=abc123yourrealkey
```

`.env.local` is listed in `.gitignore`, so your key is never committed.

### 5. Start the app

```bash
npm run dev
```

Then open **http://localhost:5173** in your browser. To stop the app, press `Ctrl + C`
in the terminal.

### 6. Try it

- Type `Johor` in **City** and `Malaysia` in **Country**, then press **Enter** or the
  🔍 button.
- Type only `Indonesia` in **Country** to see the weather for the whole country.
- Type `xxx` in **City** to see the "Not found" message.
- Use 🔍 / 🗑 on a history row to search that place again or delete it.
- Use the ☀️ / 🌙 button at the top right to switch theme.
- To see the mobile layout, open your browser's developer tools and turn on device
  mode, or open the app on your phone (see below).

### Open it on your phone (optional)

Make sure your phone and computer are on the same Wi-Fi. Then run:

```bash
npm run dev -- --host
```

Open the **Network** address it prints (for example `http://192.168.1.10:5173`) in
your phone's browser.

### Troubleshooting

| Problem | Fix |
| --- | --- |
| `npm run dev` fails with a syntax or engine error | Your Node.js is too old. Run `node -v` and upgrade to 18 or newer. |
| "No API key configured" | `.env.local` is missing or misnamed. Repeat step 4, then restart `npm run dev`. |
| "The weather service rejected the API key" | The key is wrong, or still activating (allow up to 2 hours). |
| You changed `.env.local` but nothing changed | Stop the app with `Ctrl + C` and run `npm run dev` again. Settings are only read at startup. |
| Port 5173 is already in use | Vite picks the next free port automatically. Use the URL it prints. |

## Other commands

| Script            | What it does                         |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the dev server                 |
| `npm run build`   | Type-check and build to `dist/`      |
| `npm run preview` | Serve the production build           |
| `npm test`        | Run the unit and integration tests   |
| `npm run lint`    | Lint with ESLint                     |

## Project structure

```
src/
├── api/                 # Talking to OpenWeather (no React here)
│   ├── openWeather.ts   #   fetchCurrentWeather(): AJAX call + response mapping
│   ├── WeatherApiError.ts  # typed errors with user-friendly messages
│   └── types.ts
├── hooks/               # State and behaviour (no markup)
│   ├── useWeatherSearch.ts  # validation, loading/error state, cancels stale requests
│   ├── useSearchHistory.ts  # add / remove / de-duplicate, persisted
│   ├── useTheme.ts          # light/dark, persisted
│   └── useLocalStorage.ts   # generic persisted state with validation
├── components/          # Presentational UI (props in, events out)
│   ├── SearchForm.tsx
│   ├── WeatherSummary.tsx
│   ├── SearchHistory.tsx
│   ├── IconButton.tsx   # reusable accessible icon-only button
│   ├── ThemeToggle.tsx
│   ├── ErrorMessage.tsx
│   └── icons.tsx
├── assets/              # Weather illustrations and light/dark backgrounds from the design
├── utils/               # Pure helpers: country lookup, formatting, illustration mapping
├── styles/global.css    # design tokens (CSS variables) for both themes
└── App.tsx              # wires hooks to components
```

### Design notes

- **Separation of concerns.** The API layer, the hooks (state) and the components
  (UI) are independent. You could swap the weather provider by changing only
  `src/api`.
- **Theming with CSS variables.** Components only use tokens like
  `var(--color-surface)`. A new theme is one new block of variable values in
  `global.css`.
- **CSS Modules** keep each component's styles scoped to it.
- **No extra runtime dependencies** beyond React. Country names come from the
  browser's built-in `Intl.DisplayNames`.
- **Race-safe searching.** A new search aborts the previous request with
  `AbortController`, so a slow old response can't overwrite a newer one.

## Note on the API key

Vite inlines `VITE_*` variables into the JavaScript bundle, so the key is visible
to anyone using the app. That's fine for this assessment and for OpenWeather's free
tier. A production app would call OpenWeather through a small backend proxy that
keeps the key secret.
