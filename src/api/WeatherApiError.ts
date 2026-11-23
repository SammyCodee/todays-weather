export type WeatherErrorKind =
  | 'validation' // bad user input caught before calling the API
  | 'not-found' // the API has no matching city
  | 'unauthorized' // missing or invalid API key
  | 'rate-limited' // too many requests
  | 'network' // offline / DNS / CORS failures
  | 'unknown';

const DEFAULT_MESSAGES: Record<WeatherErrorKind, string> = {
  validation: 'Please check your input.',
  'not-found': 'Not found. Please check the city and country name.',
  unauthorized: 'The weather service rejected the API key. Please check your configuration.',
  'rate-limited': 'Too many requests. Please wait a moment and try again.',
  network: 'Unable to reach the weather service. Please check your connection.',
  unknown: 'Something went wrong. Please try again.',
};

/** An error whose `message` is safe to show to the user. */
export class WeatherApiError extends Error {
  readonly kind: WeatherErrorKind;

  constructor(kind: WeatherErrorKind, message: string = DEFAULT_MESSAGES[kind]) {
    super(message);
    this.name = 'WeatherApiError';
    this.kind = kind;
  }

  /** Maps an HTTP status code from OpenWeather to a user-facing error. */
  static fromStatus(status: number): WeatherApiError {
    if (status === 400 || status === 404) return new WeatherApiError('not-found');
    if (status === 401) return new WeatherApiError('unauthorized');
    if (status === 429) return new WeatherApiError('rate-limited');
    return new WeatherApiError('unknown');
  }
}
