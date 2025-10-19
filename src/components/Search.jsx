import React, {useState, useCallback, useMemo} from 'react';

import './Search.scss';

const SearchInput = React.memo(({setError, onQueryChange, loading}) => {
  console.log('SearchInput rendered with onQueryChange:', typeof onQueryChange);
  const [query, setQuery] = useState('');
  const [isValid, setIsValid] = useState(true);

  // Memoized regex patterns for better performance
  const githubUrlRegex = useMemo(() => /(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/\s]+)\/([^\/\s]+?)(?:\.git)?\/?$/, []);
  const repoRegex = useMemo(() => /[-_\w]+\/[-_.\w]+/, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    console.log('Search form submitted');

    let repoQuery = e.target.elements[0].value.trim();
    
    if (!repoQuery) {
      setError('Please enter a repository name or GitHub URL');
      return;
    }
    
    // Function to extract repo info from GitHub URL
    const extractRepoFromUrl = (url) => {
      // Match patterns like:
      // https://github.com/owner/repo
      // https://github.com/owner/repo/
      // https://github.com/owner/repo.git
      // github.com/owner/repo
      const match = url.match(githubUrlRegex);
      
      if (match) {
        return `${match[1]}/${match[2]}`;
      }
      return null;
    };

    // Check if it's a GitHub URL first
    const repoFromUrl = extractRepoFromUrl(repoQuery);
    if (repoFromUrl) {
      console.log('Calling onQueryChange with URL:', repoFromUrl);
      onQueryChange(repoFromUrl);
      return;
    }

    // Fall back to the original regex for direct repo format
    if (repoRegex.test(repoQuery)) {
      console.log('Calling onQueryChange with repo:', repoQuery);
      onQueryChange(repoQuery);
    } else {
      setError('Invalid repository name or GitHub URL. Use format: owner/repo or https://github.com/owner/repo');
    }
  }, [onQueryChange, setError, githubUrlRegex, repoRegex]);
  
  // Function to validate input format
  const validateInput = useCallback((input) => {
    if (!input.trim()) return true; // Empty input is considered valid (no error styling)
    
    // Check if it's a GitHub URL
    if (githubUrlRegex.test(input)) return true;
    
    // Check if it's a direct repo format
    return repoRegex.test(input);
  }, [githubUrlRegex, repoRegex]);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    setIsValid(validateInput(value));
  }, [validateInput]);

  return (
    <>
      <form className="search" onSubmit={handleSubmit}>
        <input 
          icon="search" 
          type="text" 
          name="query" 
          placeholder="owner/repo or https://github.com/owner/repo"
          value={query}
          onChange={handleInputChange}
          className={!isValid ? 'invalid-input' : ''}
        />
        <button type="submit" disabled={loading} className="search-button">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </>
  );
});

export default SearchInput;
