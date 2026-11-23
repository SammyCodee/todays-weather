import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './IconButton.module.css';

export type IconButtonVariant = 'accent' | 'glass' | 'round';

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Accessible name, also shown as a tooltip. Required because the button has no visible text. */
  label: string;
  icon: ReactNode;
  /** accent = solid primary action, glass = translucent square, round = small circle (list rows). */
  variant?: IconButtonVariant;
}

/** A button that shows only an icon, with a proper accessible label. */
export function IconButton({
  label,
  icon,
  variant = 'round',
  type = 'button',
  className,
  ...buttonProps
}: IconButtonProps) {
  const classes = [styles.button, styles[variant], className].filter(Boolean).join(' ');
  return (
    <button type={type} className={classes} aria-label={label} title={label} {...buttonProps}>
      {icon}
    </button>
  );
}
