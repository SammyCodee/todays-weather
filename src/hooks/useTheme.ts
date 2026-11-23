import { useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'todays-weather:theme';

const isTheme = (value: unknown): value is Theme => value === 'light' || value === 'dark';

/** Uses the operating system's preference the first time the app is opened. */
function getSystemTheme(): Theme {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Current colour theme. The choice is remembered, and applied as
 * `<html data-theme="...">` so CSS can switch its colour tokens.
 */
export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>(THEME_STORAGE_KEY, getSystemTheme, isTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = useCallback(
    () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
    [setTheme],
  );

  return { theme, toggleTheme };
}
