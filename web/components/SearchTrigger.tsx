'use client';

import { useSearchContext } from 'fumadocs-ui/contexts/search';

/** Opens the shared Fumadocs static-search dialog used by every page. */
export function SearchTrigger() {
  const { setOpenSearch } = useSearchContext();
  return (
    <button type="button" className="search-trigger" onClick={() => setOpenSearch(true)} aria-label="Search skills">
      <span>Search</span>
      <kbd aria-hidden="true">⌘ K</kbd>
    </button>
  );
}
