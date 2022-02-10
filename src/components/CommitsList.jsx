import react, {useState} from 'react';
import prettyBytes from 'pretty-bytes';

import timeAgo from '../lib/time-ago.js';
import './CommitsList.scss';
const CommitsList = ({commits}) => {
  const [showCommits, setShowCommits] = useState(false);
  const toggleCommits = () => {
    setShowCommits(!showCommits);
  };
  return (
    <>
      <span onClick={toggleCommits} className={`commits-label ${showCommits ? 'open' : 'closed'}`}>
        <button>{showCommits ? "hide" : "show"} commits</button>
      </span>
      {showCommits && (
      <>
      {commits && commits.length > 0 && (
        <div className={"commits-menu"}>
          {commits.map(commit => (
            <div key={commit.sha}>
              <a href={`${commit.url}`} target="_blank">
                {commit.message}
              </a>
              <div>{commit.owner}</div>
              <div>{timeAgo(commit.date, 1)}</div>
            </div>
          ))}
        </div>
      )}
      </>
    )}
    </>
  );
};

export default CommitsList;
