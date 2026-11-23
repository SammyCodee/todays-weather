import type { WeatherReport } from './api/types';
import { ErrorMessage } from './components/ErrorMessage';
import { SearchForm } from './components/SearchForm';
import { SearchHistory } from './components/SearchHistory';
import { ThemeToggle } from './components/ThemeToggle';
import { WeatherSummary } from './components/WeatherSummary';
import { useSearchHistory, type HistoryEntry } from './hooks/useSearchHistory';
import { useTheme } from './hooks/useTheme';
import { useWeatherSearch, type SearchInput } from './hooks/useWeatherSearch';
import styles from './App.module.css';

/** The "Today's Weather" page: wires the hooks (state) to the components (UI). */
export default function App() {
  const { theme, toggleTheme } = useTheme();
  const history = useSearchHistory();
  const weather = useWeatherSearch();

  /** Only successful searches are saved, using the API's spelling of the place. */
  const saveToHistory = (report: WeatherReport | null) => {
    if (report) history.addEntry(report.city, report.countryCode);
  };

  const handleFormSearch = (input: SearchInput) => {
    weather.searchByInput(input).then(saveToHistory);
  };

  const handleHistorySearch = (entry: HistoryEntry) => {
    weather.search({ city: entry.city, countryCode: entry.countryCode }).then(saveToHistory);
  };

  const handleHistoryDelete = (entry: HistoryEntry) => {
    history.removeEntry(entry.id);
  };

  return (
    <div className={styles.page}>
      <header className={styles.toolbar}>
        <SearchForm
          onSearch={handleFormSearch}
          onClear={weather.clearError}
          isLoading={weather.isLoading}
        />
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>

      {weather.error && (
        <div className={styles.error}>
          <ErrorMessage message={weather.error} />
        </div>
      )}

      <main className={styles.card} data-has-report={weather.report !== null}>
        <WeatherSummary report={weather.report} isLoading={weather.isLoading} />
        <SearchHistory
          entries={history.entries}
          onSearch={handleHistorySearch}
          onDelete={handleHistoryDelete}
        />
      </main>
    </div>
  );
}
