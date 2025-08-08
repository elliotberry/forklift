import React, {useState, useCallback} from 'react';
import timeAgo from 'elliotisms/timeAgo';
import './CommitsList.scss';

// Memoized individual commit item component
const CommitItem = React.memo(({commit, format}) => {
  const formatDate = (dateString, format) => {
    if (format === 2) {
      const d = Date.parse(dateString);
      return new Date(d).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
    return timeAgo(dateString, 1);
  };

  return (
    <div key={commit.sha}>
      <a href={`${commit.url}`} target="_blank" rel="noopener noreferrer">
        {commit.message}
      </a>
      <div>{commit.owner}</div>
      <div>{formatDate(commit.date, format)}</div>
    </div>
  );
});

const CommitsList = React.memo(({commits, format}) => {
  const [showCommits, setShowCommits] = useState(false);
  
  // Early return if no commits
  if (!commits || commits.length === 0) {
    return null;
  }
  
  const toggleCommits = useCallback(() => {
    setShowCommits(prev => !prev);
  }, []);
  
  return (
    <>
      <a onClick={toggleCommits} className={`commits-label ${showCommits ? 'open' : 'closed'}`}>
        {showCommits ? "hide" : "show"} commits ({commits.length})
      </a>
      {showCommits && (
        <div className={"commits-menu"}>
          {commits.map(commit => (
            <CommitItem format={format} key={commit.sha} commit={commit} />
          ))}
        </div>
      )}
    </>
  );
});

export default CommitsList;
