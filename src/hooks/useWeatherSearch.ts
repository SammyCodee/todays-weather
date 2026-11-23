import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchCurrentWeather } from '../api/openWeather';
import { WeatherApiError } from '../api/WeatherApiError';
import type { LocationQuery, WeatherReport } from '../api/types';
import { resolveCountryCode } from '../utils/country';

/** Raw text from the search form. */
export interface SearchInput {
  city: string;
  country: string;
}

interface WeatherSearchState {
  report: WeatherReport | null;
  error: string | null;
  isLoading: boolean;
}

const INITIAL_STATE: WeatherSearchState = { report: null, error: null, isLoading: false };

/**
 * Checks the form input and turns it into an API query.
 * @throws {WeatherApiError} of kind "validation" with a user-facing message.
 */
export function toLocationQuery({ city, country }: SearchInput): LocationQuery {
  const trimmedCity = city.trim();
  const trimmedCountry = country.trim();

  if (!trimmedCity && !trimmedCountry) {
    throw new WeatherApiError('validation', 'Please enter a city or country name.');
  }
  if (!trimmedCountry) return { city: trimmedCity };

  const countryCode = resolveCountryCode(trimmedCountry);
  if (!countryCode) {
    throw new WeatherApiError('validation', `"${trimmedCountry}" is not a recognised country.`);
  }
  // City left empty means "the weather for the whole country".
  return trimmedCity ? { city: trimmedCity, countryCode } : { countryCode };
}

/**
 * Searches for today's weather and tracks loading / result / error state.
 * Starting a new search cancels any search that is still in flight, so a
 * slow old response can never overwrite a newer one.
 */
export function useWeatherSearch() {
  const [state, setState] = useState<WeatherSearchState>(INITIAL_STATE);
  const abortRef = useRef<AbortController | null>(null);

  // Cancel any pending request when the component using this hook unmounts.
  useEffect(() => () => abortRef.current?.abort(), []);

  /** Resolves with the report on success, or `null` if it failed or was cancelled. */
  const search = useCallback(async (query: LocationQuery): Promise<WeatherReport | null> => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((current) => ({ ...current, error: null, isLoading: true }));
    try {
      const report = await fetchCurrentWeather(query, { signal: controller.signal });
      setState({ report, error: null, isLoading: false });
      return report;
    } catch (error) {
      if (controller.signal.aborted) return null; // A newer search replaced this one.
      setState({ report: null, error: toMessage(error), isLoading: false });
      return null;
    }
  }, []);

  /** Validates raw form input, then searches. */
  const searchByInput = useCallback(
    (input: SearchInput): Promise<WeatherReport | null> => {
      try {
        return search(toLocationQuery(input));
      } catch (error) {
        abortRef.current?.abort();
        setState({ report: null, error: toMessage(error), isLoading: false });
        return Promise.resolve(null);
      }
    },
    [search],
  );

  const clearError = useCallback(() => setState((current) => ({ ...current, error: null })), []);

  return { ...state, search, searchByInput, clearError };
}

function toMessage(error: unknown): string {
  return error instanceof WeatherApiError ? error.message : new WeatherApiError('unknown').message;
}
