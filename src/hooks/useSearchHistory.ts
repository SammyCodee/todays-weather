import { useCallback } from 'react';
import { normalizeName } from '../utils/country';
import { useLocalStorage } from './useLocalStorage';

export const HISTORY_STORAGE_KEY = 'todays-weather:history';
export const MAX_HISTORY_ENTRIES = 20;

export interface HistoryEntry {
  /** Stable id derived from the location, so the same place is never listed twice. */
  id: string;
  city: string;
  countryCode: string;
  /** ISO timestamp of the latest search for this location. */
  searchedAt: string;
}

export function createHistoryId(city: string, countryCode: string): string {
  return `${normalizeName(city)}|${countryCode.toUpperCase()}`;
}

/**
 * Returns a new history list with the location at the top.
 * Searching a place that's already listed moves it to the top instead of
 * adding a duplicate. The list is capped at MAX_HISTORY_ENTRIES.
 */
export function addHistoryEntry(
  entries: HistoryEntry[],
  city: string,
  countryCode: string,
  searchedAt: Date = new Date(),
): HistoryEntry[] {
  const id = createHistoryId(city, countryCode);
  const newEntry: HistoryEntry = { id, city, countryCode, searchedAt: searchedAt.toISOString() };
  return [newEntry, ...entries.filter((entry) => entry.id !== id)].slice(0, MAX_HISTORY_ENTRIES);
}

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== 'object' || value === null) return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === 'string' &&
    typeof entry.city === 'string' &&
    typeof entry.countryCode === 'string' &&
    typeof entry.searchedAt === 'string'
  );
}

function isHistoryList(value: unknown): value is HistoryEntry[] {
  return Array.isArray(value) && value.every(isHistoryEntry);
}

/** The user's search history, newest first, persisted in localStorage. */
export function useSearchHistory() {
  const [entries, setEntries] = useLocalStorage<HistoryEntry[]>(
    HISTORY_STORAGE_KEY,
    () => [],
    isHistoryList,
  );

  const addEntry = useCallback(
    (city: string, countryCode: string) =>
      setEntries((current) => addHistoryEntry(current, city, countryCode)),
    [setEntries],
  );

  const removeEntry = useCallback(
    (id: string) => setEntries((current) => current.filter((entry) => entry.id !== id)),
    [setEntries],
  );

  return { entries, addEntry, removeEntry };
}
