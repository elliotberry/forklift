import React from 'react';
import './Search.scss';

const SearchInput = ({setError, onQueryChange, loading}) => {
  const handleSubmit = e => {
    e.preventDefault();

    let repoQuery = e.target.elements[0].value;
    const re = /[-_\w]+\/[-_.\w]+/;
    if (re.test(repoQuery)) {
      onQueryChange(repoQuery);
    } else {
      setError('Invalid repository name');
    }
  };

  return (
    <>
      <form className="search" onSubmit={handleSubmit}>
        <input icon="search" type="text" name="query" placeholder="heavyimage/MapleMatrix"></input>
        <button type="submit" disabled={loading} className="search-button">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </>
  );
};

export default SearchInput;
