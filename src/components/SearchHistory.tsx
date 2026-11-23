import type { HistoryEntry } from '../hooks/useSearchHistory';
import { formatDateTime, formatLocation } from '../utils/format';
import { IconButton } from './IconButton';
import { SearchIcon, TrashIcon } from './icons';
import styles from './SearchHistory.module.css';

interface SearchHistoryProps {
  entries: HistoryEntry[];
  onSearch: (entry: HistoryEntry) => void;
  onDelete: (entry: HistoryEntry) => void;
}

/** The list of past searches, newest first, each with search-again and delete buttons. */
export function SearchHistory({ entries, onSearch, onDelete }: SearchHistoryProps) {
  return (
    <section className={styles.panel} aria-labelledby="history-title">
      <h2 id="history-title" className={styles.title}>
        Search History
      </h2>

      {entries.length === 0 ? (
        <p className={styles.empty}>No Record</p>
      ) : (
        <ol className={styles.list}>
          {entries.map((entry) => (
            <SearchHistoryItem key={entry.id} entry={entry} onSearch={onSearch} onDelete={onDelete} />
          ))}
        </ol>
      )}
    </section>
  );
}

interface SearchHistoryItemProps {
  entry: HistoryEntry;
  onSearch: (entry: HistoryEntry) => void;
  onDelete: (entry: HistoryEntry) => void;
}

function SearchHistoryItem({ entry, onSearch, onDelete }: SearchHistoryItemProps) {
  const location = formatLocation(entry.city, entry.countryCode);
  return (
    <li className={styles.item}>
      <div className={styles.text}>
        <span className={styles.location}>{location}</span>
        <time className={styles.time} dateTime={entry.searchedAt}>
          {formatDateTime(new Date(entry.searchedAt))}
        </time>
      </div>
      <div className={styles.actions}>
        <IconButton label={`Search ${location} again`} icon={<SearchIcon />} onClick={() => onSearch(entry)} />
        <IconButton label={`Delete ${location} from history`} icon={<TrashIcon />} onClick={() => onDelete(entry)} />
      </div>
    </li>
  );
}
