/**
 * A location the user asked for, after validation (country is an ISO 3166
 * alpha-2 code). At least one of the two is set: a city, a city in a
 * country, or a whole country.
 */
export interface LocationQuery {
  city?: string;
  countryCode?: string;
}

/** The weather data the UI needs, already mapped from OpenWeather's response shape. */
export interface WeatherReport {
  /** City name as returned by the API (correct casing, e.g. "Johor"). */
  city: string;
  /** ISO 3166 alpha-2 country code, e.g. "MY". */
  countryCode: string;
  /** Weather group, e.g. "Clouds". */
  main: string;
  /** Detailed condition, e.g. "scattered clouds". */
  description: string;
  /** OpenWeather icon id, e.g. "03d". */
  iconCode: string;
  /** Temperatures in °C. */
  temperature: number;
  tempMin: number;
  tempMax: number;
  /** Relative humidity in percent. */
  humidity: number;
  /** When the user received this report. */
  fetchedAt: Date;
}

/** The subset of the OpenWeather "current weather" response we read. */
export interface OpenWeatherCurrentResponse {
  name: string;
  sys: { country: string };
  weather: Array<{ main: string; description: string; icon: string }>;
  main: { temp: number; temp_min: number; temp_max: number; humidity: number };
}
