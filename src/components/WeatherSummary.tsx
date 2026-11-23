import type { WeatherReport } from '../api/types';
import { capitalize, formatDateTime, formatLocation, formatTemperature } from '../utils/format';
import { getWeatherIllustration } from '../utils/weatherIllustration';
import styles from './WeatherSummary.module.css';

interface WeatherSummaryProps {
  report: WeatherReport | null;
  isLoading?: boolean;
}

/** The top of the card: big temperature, condition, humidity, place and time. */
export function WeatherSummary({ report, isLoading = false }: WeatherSummaryProps) {
  return (
    <section className={styles.summary} aria-labelledby="weather-title" aria-busy={isLoading}>
      <h1 id="weather-title" className={styles.title}>
        Today&rsquo;s Weather
      </h1>

      {report ? (
        <WeatherDetails report={report} />
      ) : (
        <p className={styles.placeholder}>
          {isLoading ? 'Loading weather…' : 'Search for a city to see today’s weather.'}
        </p>
      )}
    </section>
  );
}

function WeatherDetails({ report }: { report: WeatherReport }) {
  return (
    <div className={styles.details}>
      <img
        className={styles.icon}
        src={getWeatherIllustration(report.main)}
        alt=""
        width={600}
        height={600}
      />

      <p className={styles.temperature}>
        {formatTemperature(report.temperature)}
        <span className="visually-hidden">C</span>
      </p>
      <p className={styles.range}>
        H: {formatTemperature(report.tempMax)} L: {formatTemperature(report.tempMin)}
      </p>
      <p className={styles.location}>{formatLocation(report.city, report.countryCode)}</p>
      <p className={styles.time}>
        <time dateTime={report.fetchedAt.toISOString()}>{formatDateTime(report.fetchedAt)}</time>
      </p>
      <p className={styles.humidity}>Humidity: {report.humidity}%</p>
      <p className={styles.condition}>
        {report.main}
        {report.description && (
          <span className={styles.description}>{capitalize(report.description)}</span>
        )}
      </p>
    </div>
  );
}
