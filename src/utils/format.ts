const pad = (value: number) => String(value).padStart(2, '0');

/**
 * Formats a date like the mockup: "01-09-2022 09:41am" (dd-MM-yyyy hh:mma),
 * in the user's local time zone.
 */
export function formatDateTime(date: Date): string {
  const hours12 = date.getHours() % 12 || 12;
  const meridiem = date.getHours() < 12 ? 'am' : 'pm';
  return (
    `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} ` +
    `${pad(hours12)}:${pad(date.getMinutes())}${meridiem}`
  );
}

/** Rounds a temperature to a whole degree: 26.4 -> "26°". */
export function formatTemperature(celsius: number): string {
  // Math.round(-0.4) is -0, which would print as "-0°".
  return `${Math.round(celsius) || 0}°`;
}

/** "Johor" + "MY" -> "Johor, MY". */
export function formatLocation(city: string, countryCode?: string): string {
  return countryCode ? `${city}, ${countryCode}` : city;
}

/** "scattered clouds" -> "Scattered clouds". */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
