import { getCountrySearchName } from '../utils/country';
import { WeatherApiError } from './WeatherApiError';
import type { LocationQuery, OpenWeatherCurrentResponse, WeatherReport } from './types';

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

/** Converts the raw API response into the shape our UI uses. */
export function toWeatherReport(data: OpenWeatherCurrentResponse, fetchedAt = new Date()): WeatherReport {
  const [condition] = data.weather;
  return {
    city: data.name,
    countryCode: data.sys.country,
    main: condition?.main ?? 'Unknown',
    description: condition?.description ?? '',
    iconCode: condition?.icon ?? '01d',
    temperature: data.main.temp,
    tempMin: data.main.temp_min,
    tempMax: data.main.temp_max,
    humidity: data.main.humidity,
    fetchedAt,
  };
}

/**
 * Builds OpenWeather's `q` parameter:
 *   city only        -> "Johor"
 *   city + country   -> "Johor,MY"
 *   country only     -> "Malaysia,MY" (OpenWeather returns country-level weather)
 */
export function buildSearchText({ city, countryCode }: LocationQuery): string {
  if (city && countryCode) return `${city},${countryCode}`;
  if (city) return city;
  if (countryCode) return `${getCountrySearchName(countryCode)},${countryCode}`;
  throw new WeatherApiError('validation', 'Please enter a city or country name.');
}

interface FetchOptions {
  signal?: AbortSignal;
  apiKey?: string;
}

/**
 * Fetches the current weather for a city (optionally narrowed by country) from
 * OpenWeather's Current Weather API, in metric units.
 *
 * @throws {WeatherApiError} with a user-facing message for every failure.
 * @throws {DOMException} named "AbortError" when `signal` is aborted.
 */
export async function fetchCurrentWeather(
  { city, countryCode }: LocationQuery,
  { signal, apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY }: FetchOptions = {},
): Promise<WeatherReport> {
  if (!apiKey) {
    throw new WeatherApiError(
      'unauthorized',
      'No API key configured. Add VITE_OPENWEATHER_API_KEY to your .env.local file.',
    );
  }

  const params = new URLSearchParams({
    q: buildSearchText({ city, countryCode }),
    units: 'metric',
    appid: apiKey,
  });

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}?${params}`, { signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new WeatherApiError('network');
  }

  if (!response.ok) throw WeatherApiError.fromStatus(response.status);

  const report = toWeatherReport((await response.json()) as OpenWeatherCurrentResponse);

  // OpenWeather silently ignores a country it can't match and returns a city
  // from somewhere else, so we double-check the country ourselves.
  if (countryCode && report.countryCode !== countryCode) {
    throw new WeatherApiError('not-found');
  }

  return report;
}
