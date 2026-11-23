import { describe, expect, it } from 'vitest';
import { addHistoryEntry, MAX_HISTORY_ENTRIES, type HistoryEntry } from './useSearchHistory';

describe('addHistoryEntry', () => {
  it('puts the newest search first', () => {
    let entries: HistoryEntry[] = [];
    entries = addHistoryEntry(entries, 'Osaka', 'JP');
    entries = addHistoryEntry(entries, 'Johor', 'MY');
    expect(entries.map((entry) => entry.city)).toEqual(['Johor', 'Osaka']);
  });

  it('moves a repeated location to the top instead of duplicating it', () => {
    let entries: HistoryEntry[] = [];
    entries = addHistoryEntry(entries, 'Osaka', 'JP', new Date('2022-09-01T01:00:00Z'));
    entries = addHistoryEntry(entries, 'Johor', 'MY');
    entries = addHistoryEntry(entries, 'osaka', 'jp', new Date('2022-09-01T02:00:00Z'));

    expect(entries).toHaveLength(2);
    expect(entries[0]).toMatchObject({ city: 'osaka', searchedAt: '2022-09-01T02:00:00.000Z' });
  });

  it(`keeps at most ${MAX_HISTORY_ENTRIES} entries`, () => {
    let entries: HistoryEntry[] = [];
    for (let i = 0; i < MAX_HISTORY_ENTRIES + 5; i++) {
      entries = addHistoryEntry(entries, `City ${i}`, 'MY');
    }
    expect(entries).toHaveLength(MAX_HISTORY_ENTRIES);
    expect(entries[0].city).toBe(`City ${MAX_HISTORY_ENTRIES + 4}`);
  });
});
