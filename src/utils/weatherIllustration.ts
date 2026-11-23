import cloudImage from '../assets/cloud.png';
import sunImage from '../assets/sun.png';

/**
 * Weather groups (OpenWeather's `weather[0].main`) that get the sun-and-cloud
 * illustration. Everything else — Rain, Drizzle, Thunderstorm, Snow, Mist,
 * Haze, Fog, etc. — gets the plain rain cloud.
 *
 * To support more artwork later, add an image to src/assets and a case here.
 */
const SUNNY_CONDITIONS = new Set(['Clear', 'Clouds']);

/** Returns the illustration URL for a weather group such as "Clouds". */
export function getWeatherIllustration(condition: string): string {
  return SUNNY_CONDITIONS.has(condition) ? sunImage : cloudImage;
}
