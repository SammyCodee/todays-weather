import type { OpenWeatherCurrentResponse } from '../api/types';

/** Builds a realistic OpenWeather response; override any field per test. */
export function makeApiResponse(
  overrides: Partial<{ name: string; country: string; main: string; temp: number }> = {},
): OpenWeatherCurrentResponse {
  return {
    name: overrides.name ?? 'Johor',
    sys: { country: overrides.country ?? 'MY' },
    weather: [{ main: overrides.main ?? 'Clouds', description: 'scattered clouds', icon: '03d' }],
    main: { temp: overrides.temp ?? 26.4, temp_min: 25.6, temp_max: 29.1, humidity: 58 },
  };
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
