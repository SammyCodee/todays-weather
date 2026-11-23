# Today's Weather

A small React + TypeScript app that shows today's weather for any city using the
[OpenWeather Current Weather API](https://openweathermap.org/current), and keeps a
search history you can re-run or delete. It has light and dark themes and works from
small phones up to desktop screens.

UI behaviour decisions are listed in [ASSUMPTIONS.md](ASSUMPTIONS.md).

## Features

- Search by **city** and optional **country**. The country can be a name ("Malaysia",
  "South Korea") or an ISO code ("MY", "KR").
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

## Getting started

Requires **Node.js 18+**.

```bash
npm install
cp .env.example .env.local      # then put your OpenWeather API key in .env.local
npm run dev                     # http://localhost:5173
```

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
