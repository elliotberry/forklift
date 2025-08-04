import React, {useState, useEffect, useCallback} from 'react';
import {debounce} from '../lib/util.js';
import './Search.scss';

const SearchInput = React.memo(({setError, onQueryChange, loading}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    let repoQuery = e.target.elements[0].value;
    const re = /[-_\w]+\/[-_.\w]+/;
    if (re.test(repoQuery)) {
      onQueryChange(repoQuery);
    } else {
      setError('Invalid repository name');
    }
  }, [onQueryChange, setError]);

  const handleInputChange = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

  return (
    <>
      <form className="search" onSubmit={handleSubmit}>
        <input 
          icon="search" 
          type="text" 
          name="query" 
          placeholder="heavyimage/MapleMatrix"
          value={query}
          onChange={handleInputChange}
        />
        <button type="submit" disabled={loading} className="search-button">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </>
  );
});

export default SearchInput;
