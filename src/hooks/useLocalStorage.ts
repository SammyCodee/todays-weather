import { useEffect, useState } from 'react';

/**
 * Like `useState`, but the value is saved to `localStorage` and restored on
 * the next visit.
 *
 * @param key           localStorage key.
 * @param getInitial    Value to use when nothing (valid) is stored yet.
 * @param isValid       Guards against corrupted or outdated stored data.
 */
export function useLocalStorage<T>(
  key: string,
  getInitial: () => T,
  isValid: (value: unknown) => value is T,
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        const parsed: unknown = JSON.parse(raw);
        if (isValid(parsed)) return parsed;
      }
    } catch {
      // Storage can be blocked (private mode) or hold invalid JSON — fall back.
    }
    return getInitial();
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore quota / privacy errors: the app still works, it just won't persist.
    }
  }, [key, value]);

  return [value, setValue] as const;
}
