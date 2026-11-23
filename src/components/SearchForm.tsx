import { useId, useState, type FormEvent } from 'react';
import type { SearchInput } from '../hooks/useWeatherSearch';
import { IconButton } from './IconButton';
import { CloseIcon, SearchIcon, SpinnerIcon } from './icons';
import styles from './SearchForm.module.css';

interface SearchFormProps {
  onSearch: (input: SearchInput) => void;
  /** Called after the inputs are reset by the Clear button. */
  onClear: () => void;
  isLoading?: boolean;
}

const EMPTY_INPUT: SearchInput = { city: '', country: '' };

/** City + Country inputs with Search and Clear buttons. Pressing Enter also searches. */
export function SearchForm({ onSearch, onClear, isLoading = false }: SearchFormProps) {
  const [input, setInput] = useState<SearchInput>(EMPTY_INPUT);
  const cityId = useId();
  const countryId = useId();

  const updateField = (field: keyof SearchInput) => (event: { target: { value: string } }) =>
    setInput((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(input);
  };

  const handleClear = () => {
    setInput(EMPTY_INPUT);
    onClear();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} role="search" aria-label="Weather search">
      <div className={styles.fields}>
        <div className={styles.field}>
          <label htmlFor={cityId} className={styles.label}>
            City
          </label>
          <input
            id={cityId}
            className={styles.input}
            type="text"
            name="city"
            value={input.city}
            onChange={updateField('city')}
            placeholder="e.g. Johor"
            autoComplete="address-level2"
            enterKeyHint="search"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor={countryId} className={styles.label}>
            Country
          </label>
          <input
            id={countryId}
            className={styles.input}
            type="text"
            name="country"
            value={input.country}
            onChange={updateField('country')}
            placeholder="e.g. Malaysia or MY"
            autoComplete="country-name"
            enterKeyHint="search"
          />
        </div>
      </div>

      <div className={styles.actions}>
        <IconButton
          type="submit"
          variant="accent"
          label="Search"
          aria-busy={isLoading}
          icon={isLoading ? <SpinnerIcon className={styles.spinner} /> : <SearchIcon />}
        />
        <IconButton variant="glass" label="Clear" icon={<CloseIcon />} onClick={handleClear} />
      </div>
    </form>
  );
}
