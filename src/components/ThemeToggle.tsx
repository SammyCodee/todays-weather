import type { Theme } from '../hooks/useTheme';
import { IconButton } from './IconButton';
import { MoonIcon, SunIcon } from './icons';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

/** Switches between light and dark mode. The icon shows the theme you'll switch *to*. */
export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  return (
    <IconButton
      variant="glass"
      label={`Switch to ${nextTheme} mode`}
      icon={nextTheme === 'dark' ? <MoonIcon /> : <SunIcon />}
      onClick={onToggle}
    />
  );
}
