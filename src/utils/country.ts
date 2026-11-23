/**
 * Turns whatever the user typed in the "Country" field ("Malaysia", "my",
 * "South Korea", "USA") into an ISO 3166 alpha-2 code that OpenWeather accepts.
 *
 * Country names come from the browser's built-in `Intl.DisplayNames`, so we
 * don't need to ship a country list.
 */

/** Common names people type that `Intl.DisplayNames` doesn't produce. */
const COUNTRY_ALIASES: Record<string, string> = {
  usa: 'US',
  america: 'US',
  unitedstatesofamerica: 'US',
  uk: 'GB',
  britain: 'GB',
  greatbritain: 'GB',
  england: 'GB',
  scotland: 'GB',
  wales: 'GB',
  korea: 'KR',
  republicofkorea: 'KR',
  uae: 'AE',
  holland: 'NL',
  czechia: 'CZ',
  burma: 'MM',
  vietnam: 'VN',
};

/** Lower-cases and strips accents, spaces and punctuation: "Côte d’Ivoire" -> "cotedivoire". */
export function normalizeName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/** Region codes that are groupings, not countries. */
const NON_COUNTRY_CODES = new Set(['EU', 'EZ', 'UN', 'QO']);

let nameToCode: Map<string, string> | null = null;
let validCodes: Set<string> | null = null;

/** Builds the name -> code lookup once, on first use. */
function buildLookup(): void {
  nameToCode = new Map();
  validCodes = new Set();
  const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
  const A = 'A'.charCodeAt(0);

  for (let first = 0; first < 26; first++) {
    for (let second = 0; second < 26; second++) {
      const code = String.fromCharCode(A + first, A + second);
      const name = displayNames.of(code);
      // Unknown codes are echoed back unchanged (or as "Unknown Region").
      if (!name || name === code || name === 'Unknown Region') continue;
      // Skip legacy aliases such as "UK" (canonical "GB") and groupings like "EU".
      if (new Intl.Locale(`und-${code}`).region !== code || NON_COUNTRY_CODES.has(code)) continue;

      validCodes.add(code);
      nameToCode.set(normalizeName(name), code);
      // "Myanmar (Burma)" should also match "Myanmar".
      const withoutParentheses = name.replace(/\s*\(.*\)$/, '');
      if (withoutParentheses !== name) nameToCode.set(normalizeName(withoutParentheses), code);
    }
  }
  for (const [alias, code] of Object.entries(COUNTRY_ALIASES)) {
    nameToCode.set(alias, code);
  }
}

/**
 * Resolves a country name or code to an ISO alpha-2 code.
 * Returns `null` if the input isn't a recognisable country.
 */
export function resolveCountryCode(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (!nameToCode || !validCodes) buildLookup();

  const upper = trimmed.toUpperCase();
  if (/^[A-Z]{2}$/.test(upper) && validCodes!.has(upper)) return upper;

  return nameToCode!.get(normalizeName(trimmed)) ?? null;
}

/** Countries whose English name OpenWeather doesn't recognise, mapped to one it does. */
const OPENWEATHER_COUNTRY_NAMES: Record<string, string> = {
  KR: 'Republic of Korea',
};

/**
 * The name to send to OpenWeather when searching a whole country, e.g.
 * "MY" -> "Malaysia". OpenWeather returns country-level weather for these.
 */
export function getCountrySearchName(code: string): string {
  const override = OPENWEATHER_COUNTRY_NAMES[code];
  if (override) return override;
  const name = new Intl.DisplayNames(['en'], { type: 'region' }).of(code) ?? code;
  return name.replace(/\s*\(.*\)$/, ''); // "Myanmar (Burma)" -> "Myanmar"
}
