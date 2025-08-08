import React, {useState} from 'react';


import timeAgo from '../lib/time-ago.js';
import './CommitsList.scss';

// Memoized individual commit item component
const CommitItem = React.memo(({commit, format}) => {
  let date = timeAgo(commit.date, 1);
  if (format === 2) {
    let d = Date.parse(commit.date);
    date = new Date(d).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }
  return (
  <div key={commit.sha}>
    <a href={`${commit.url}`} target="_blank" rel="noopener noreferrer">
      {commit.message}
    </a>
    <div>{commit.owner}</div>
    <div>{date}</div>
  </div>
)});

const CommitsList = React.memo(({commits, format}) => {
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
