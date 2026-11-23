import { describe, expect, it } from 'vitest';
import { capitalize, formatDateTime, formatLocation, formatTemperature } from './format';

describe('formatDateTime', () => {
  it('formats morning times as dd-MM-yyyy hh:mmam', () => {
    expect(formatDateTime(new Date(2022, 8, 1, 9, 41))).toBe('01-09-2022 09:41am');
  });

  it('formats noon and midnight as 12', () => {
    expect(formatDateTime(new Date(2022, 8, 1, 12, 5))).toBe('01-09-2022 12:05pm');
    expect(formatDateTime(new Date(2022, 8, 1, 0, 5))).toBe('01-09-2022 12:05am');
  });
});

describe('formatTemperature', () => {
  it('rounds to a whole degree', () => {
    expect(formatTemperature(26.4)).toBe('26°');
    expect(formatTemperature(-2.6)).toBe('-3°');
  });

  it('never shows "-0°"', () => {
    expect(formatTemperature(-0.3)).toBe('0°');
  });
});

describe('formatLocation / capitalize', () => {
  it('joins city and country code', () => {
    expect(formatLocation('Johor', 'MY')).toBe('Johor, MY');
    expect(formatLocation('Johor')).toBe('Johor');
  });

  it('capitalises the first letter', () => {
    expect(capitalize('scattered clouds')).toBe('Scattered clouds');
  });
});
