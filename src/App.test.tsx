import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { jsonResponse, makeApiResponse } from './test/fixtures';

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubEnv('VITE_OPENWEATHER_API_KEY', 'test-key');
  vi.stubGlobal('fetch', fetchMock);
  fetchMock.mockReset();
});

async function searchFor(city: string, country = '') {
  const user = userEvent.setup();
  const cityInput = screen.getByLabelText('City');
  const countryInput = screen.getByLabelText('Country');
  await user.clear(cityInput);
  await user.clear(countryInput);
  await user.type(cityInput, city);
  if (country) await user.type(countryInput, country);
  await user.click(screen.getByRole('button', { name: 'Search' }));
  return user;
}

const historyList = () => screen.getByRole('region', { name: 'Search History' });

describe('App', () => {
  it('shows an empty history and a prompt before any search', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Today’s Weather' })).toBeInTheDocument();
    expect(screen.getByText('No Record')).toBeInTheDocument();
  });

  it('shows the weather and records the search in history', async () => {
    fetchMock.mockResolvedValue(jsonResponse(makeApiResponse()));
    render(<App />);

    await searchFor('johor', 'Malaysia');

    expect(await screen.findByText('26°')).toBeInTheDocument();
    expect(screen.getByText('Clouds')).toBeInTheDocument();
    expect(screen.getByText('Humidity: 58%')).toBeInTheDocument();
    expect(within(historyList()).getByText('Johor, MY')).toBeInTheDocument();
    expect(new URL(fetchMock.mock.calls[0][0]).searchParams.get('q')).toBe('johor,MY');
  });

  it('shows "Not found" for an unknown city and does not record it', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: 'city not found' }, 404));
    render(<App />);

    await searchFor('xxx');

    expect(await screen.findByRole('alert')).toHaveTextContent(/not found/i);
    expect(screen.getByText('No Record')).toBeInTheDocument();
  });

  it('validates the inputs without calling the API', async () => {
    render(<App />);

    await searchFor('Johor', 'Atlantis');
    expect(screen.getByRole('alert')).toHaveTextContent('"Atlantis" is not a recognised country.');

    await searchFor('   ');
    expect(screen.getByRole('alert')).toHaveTextContent('Please enter a city or country name.');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('searches a whole country when only the country is filled in', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(makeApiResponse({ name: 'Indonesia', country: 'ID', temp: 30 })),
    );
    render(<App />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('Country'), 'indonesia');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(await screen.findByText('30°')).toBeInTheDocument();
    expect(new URL(fetchMock.mock.calls[0][0]).searchParams.get('q')).toBe('Indonesia,ID');
    expect(within(historyList()).getByText('Indonesia, ID')).toBeInTheDocument();
  });

  it('Clear empties the inputs and dismisses the error', async () => {
    render(<App />);
    const user = await searchFor('Johor', 'Atlantis');

    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(screen.getByLabelText('City')).toHaveValue('');
    expect(screen.getByLabelText('Country')).toHaveValue('');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('can search again and delete from history', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(makeApiResponse({ name: 'Osaka', country: 'JP' })))
      .mockResolvedValueOnce(jsonResponse(makeApiResponse({ name: 'Johor', country: 'MY' })))
      .mockResolvedValueOnce(jsonResponse(makeApiResponse({ name: 'Osaka', country: 'JP', temp: 18 })));
    render(<App />);

    await searchFor('Osaka', 'JP');
    await screen.findByText('Osaka, JP', { selector: 'p' });
    const user = await searchFor('Johor', 'MY');
    await screen.findByText('Johor, MY', { selector: 'p' });

    // Search Osaka again from history: it refreshes and moves to the top.
    await user.click(screen.getByRole('button', { name: 'Search Osaka, JP again' }));
    expect(await screen.findByText('18°')).toBeInTheDocument();
    const items = within(historyList()).getAllByRole('listitem');
    expect(items.map((item) => item.textContent)).toEqual([
      expect.stringContaining('Osaka, JP'),
      expect.stringContaining('Johor, MY'),
    ]);

    // Delete both entries.
    await user.click(screen.getByRole('button', { name: 'Delete Osaka, JP from history' }));
    await user.click(screen.getByRole('button', { name: 'Delete Johor, MY from history' }));
    expect(within(historyList()).getByText('No Record')).toBeInTheDocument();
  });

  it('remembers history across page reloads', async () => {
    fetchMock.mockResolvedValue(jsonResponse(makeApiResponse()));
    const { unmount } = render(<App />);
    await searchFor('Johor', 'MY');
    await within(historyList()).findByText('Johor, MY');
    unmount();

    render(<App />);
    expect(within(historyList()).getByText('Johor, MY')).toBeInTheDocument();
  });

  it('switches between light and dark theme', async () => {
    const user = userEvent.setup();
    render(<App />);
    const initial = document.documentElement.dataset.theme;
    const next = initial === 'dark' ? 'light' : 'dark';

    await user.click(screen.getByRole('button', { name: `Switch to ${next} mode` }));

    expect(document.documentElement.dataset.theme).toBe(next);
  });
});
