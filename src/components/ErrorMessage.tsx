import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string;
}

/** An inline error banner. `role="alert"` makes screen readers announce it immediately. */
export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <p className={styles.error} role="alert">
      {message}
    </p>
  );
}
