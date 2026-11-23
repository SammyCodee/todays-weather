import { describe, expect, it } from 'vitest';
import cloudImage from '../assets/cloud.png';
import sunImage from '../assets/sun.png';
import { getWeatherIllustration } from './weatherIllustration';

describe('getWeatherIllustration', () => {
  it.each(['Clear', 'Clouds'])('uses the sun image for %s', (condition) => {
    expect(getWeatherIllustration(condition)).toBe(sunImage);
  });

  it.each(['Rain', 'Drizzle', 'Thunderstorm', 'Snow', 'Mist', 'Unknown'])(
    'uses the cloud image for %s',
    (condition) => {
      expect(getWeatherIllustration(condition)).toBe(cloudImage);
    },
  );
});
