import { describe, expect, it, vi } from 'vitest';
import { jsonResponse, makeApiResponse } from '../test/fixtures';
import { buildSearchText, fetchCurrentWeather } from './openWeather';
import { WeatherApiError } from './WeatherApiError';

const options = { apiKey: 'test-key' };

describe('buildSearchText', () => {
  it('handles city, city + country, and country only', () => {
    expect(buildSearchText({ city: 'Johor' })).toBe('Johor');
    expect(buildSearchText({ city: 'Johor', countryCode: 'MY' })).toBe('Johor,MY');
    expect(buildSearchText({ countryCode: 'ID' })).toBe('Indonesia,ID');
  });

  it('uses the names OpenWeather recognises for whole-country searches', () => {
    expect(buildSearchText({ countryCode: 'KR' })).toBe('Republic of Korea,KR');
    expect(buildSearchText({ countryCode: 'MM' })).toBe('Myanmar,MM');
  });

  it('rejects an empty query', () => {
    expect(() => buildSearchText({})).toThrow(WeatherApiError);
  });
});

describe('fetchCurrentWeather', () => {
  it('calls the API with city, country and metric units, and maps the response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(makeApiResponse()));
    vi.stubGlobal('fetch', fetchMock);

    const report = await fetchCurrentWeather({ city: 'Johor', countryCode: 'MY' }, options);

    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.searchParams.get('q')).toBe('Johor,MY');
    expect(url.searchParams.get('units')).toBe('metric');
    expect(url.searchParams.get('appid')).toBe('test-key');
    expect(report).toMatchObject({
      city: 'Johor',
      countryCode: 'MY',
      main: 'Clouds',
      description: 'scattered clouds',
      humidity: 58,
    });
  });

  it('throws a "not-found" error on 404', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ message: 'city not found' }, 404)));

    await expect(fetchCurrentWeather({ city: 'xxx' }, options)).rejects.toMatchObject({
      kind: 'not-found',
    });
  });

  it('throws "not-found" when the API returns a city in a different country', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(makeApiResponse({ country: 'GB' }))));

    await expect(
      fetchCurrentWeather({ city: 'London', countryCode: 'JP' }, options),
    ).rejects.toMatchObject({ kind: 'not-found' });
  });

  it('throws an "unauthorized" error on 401', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({}, 401)));

    await expect(fetchCurrentWeather({ city: 'Johor' }, options)).rejects.toMatchObject({
      kind: 'unauthorized',
    });
  });

  it('throws a "network" error when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    const error = await fetchCurrentWeather({ city: 'Johor' }, options).catch((e) => e);
    expect(error).toBeInstanceOf(WeatherApiError);
    expect(error.kind).toBe('network');
  });

  it('refuses to call the API without a key', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchCurrentWeather({ city: 'Johor' }, { apiKey: '' })).rejects.toMatchObject({
      kind: 'unauthorized',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
