import React, {useState} from 'react';
import prettyBytes from 'pretty-bytes';

import timeAgo from '../lib/time-ago.js';
import './CommitsList.scss';

// Memoized individual commit item component
const CommitItem = React.memo(({commit}) => (
  <div key={commit.sha}>
    <a href={`${commit.url}`} target="_blank" rel="noopener noreferrer">
      {commit.message}
    </a>
    <div>{commit.owner}</div>
    <div>{timeAgo(commit.date, 1)}</div>
  </div>
));

const CommitsList = React.memo(({commits}) => {
  const [showCommits, setShowCommits] = useState(false);
  
  // Early return if no commits
  if (!commits || commits.length === 0) {
    return null;
  }
  
  const toggleCommits = () => {
    setShowCommits(!showCommits);
  };
  
  return (
    <>
      <span onClick={toggleCommits} className={`commits-label ${showCommits ? 'open' : 'closed'}`}>
        <button>{showCommits ? "hide" : "show"} commits ({commits.length})</button>
      </span>
      {showCommits && (
        <div className={"commits-menu"}>
          {commits.map(commit => (
            <CommitItem key={commit.sha} commit={commit} />
          ))}
        </div>
      )}
    </>
  );
});

export default CommitsList;
