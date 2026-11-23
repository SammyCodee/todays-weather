import { describe, expect, it } from 'vitest';
import { normalizeName, resolveCountryCode } from './country';

describe('resolveCountryCode', () => {
  it.each([
    ['MY', 'MY'],
    ['my', 'MY'],
    ['Malaysia', 'MY'],
    ['  japan ', 'JP'],
    ['South Korea', 'KR'],
    ['singapore', 'SG'],
    ['USA', 'US'],
    ['UK', 'GB'],
    ['United Kingdom', 'GB'],
    ['Myanmar', 'MM'],
  ])('resolves "%s" to %s', (input, expected) => {
    expect(resolveCountryCode(input)).toBe(expected);
  });

  it.each(['', '   ', 'Atlantis', 'XX', 'ZZ'])('returns null for "%s"', (input) => {
    expect(resolveCountryCode(input)).toBeNull();
  });
});

describe('normalizeName', () => {
  it('ignores case, accents, spaces and punctuation', () => {
    expect(normalizeName('Côte d’Ivoire')).toBe('cotedivoire');
  });
});
