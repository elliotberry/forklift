import React from 'react';
import useLocalStorage from './useLocalStorage';
import './Config.scss';

const useConfig = () => {
  const [token, setToken] = useLocalStorage('token', '');
  const [loadCommits, setLoadCommits] = useLocalStorage('loadCommits', true);
  const [loadCommitsOnlyForAhead, setLoadCommitsOnlyForAhead] = useLocalStorage('loadCommitsOnlyForAhead', true);
  const [showOnlyAheadForks, setShowOnlyAheadForks] = useLocalStorage('showOnlyAheadForks', true);
  const [headerAnimation, setHeaderAnimation] = useLocalStorage('headerAnimation', true);
  const [prettyTimeFormat, setPrettyTimeFormat] = useLocalStorage('prettyTimeFormat', 1);

  const Config = React.memo(() => {
    const handleTokenChange = React.useCallback((e) => {
      setToken(e.target.value);
    }, [setToken]);

    const handleLoadCommitsChange = React.useCallback((e) => {
      setLoadCommits(e.target.checked);
    }, [setLoadCommits]);

    const handleLoadCommitsOnlyForAheadChange = React.useCallback((e) => {
      setLoadCommitsOnlyForAhead(e.target.checked);
    }, [setLoadCommitsOnlyForAhead]);

    const handleShowOnlyAheadForksChange = React.useCallback((e) => {
      setShowOnlyAheadForks(e.target.checked);
    }, [setShowOnlyAheadForks]);

    const handleHeaderAnimationChange = React.useCallback((e) => {
      setHeaderAnimation(e.target.checked);
    }, [setHeaderAnimation]);

    const handlePrettyTimeFormatChange = React.useCallback((e) => {
      setPrettyTimeFormat(parseInt(e.target.value));
    }, [setPrettyTimeFormat]);

    return (
      <>
        <form
          className="config"
          onSubmit={e => {
            e.preventDefault();
          }}>
          <span className="small">Configuration</span>
          <div className="field text-field">
            <label htmlFor="token">Github token</label>
            <input
              id="token"
              placeholder="github token"
              value={token}
              name="token"
              type="text"
              onChange={handleTokenChange}
            />
          </div>
          <div className="field checkbox-field">
            <input
              id="loadCommits"
              name="loadCommits"
              type="checkbox"
              checked={loadCommits}
              onChange={handleLoadCommitsChange}
            />
            <label htmlFor="loadCommits">Load commits during search</label>
          </div>
          {loadCommits && (
            <div className="field checkbox-field">
              <input
                id="loadCommitsOnlyForAhead"
                name="loadCommitsOnlyForAhead"
                type="checkbox"
                checked={loadCommitsOnlyForAhead}
                onChange={handleLoadCommitsOnlyForAheadChange}
              />
              <label htmlFor="loadCommitsOnlyForAhead">Only load commits for repos that are ahead</label>
            </div>
          )}
          <div className="field checkbox-field">
            <input
              id="showOnlyAheadForks"
              name="showOnlyAheadForks"
              type="checkbox"
              checked={showOnlyAheadForks}
              onChange={handleShowOnlyAheadForksChange}
            />
            <label htmlFor="showOnlyAheadForks">Only show forks that are ahead of original</label>
          </div>
          <div className="field checkbox-field">
            <input
              id="headerAnimation"
              name="headerAnimation"
              type="checkbox"
              checked={headerAnimation}
              onChange={handleHeaderAnimationChange}
            />
            <label htmlFor="headerAnimation">Enable header animation</label>
          </div>


          <div className="field select-field">
            <label htmlFor="prettyTimeFormat">Time format</label>
            <select
              id="prettyTimeFormat"
              value={prettyTimeFormat}
              onChange={handlePrettyTimeFormatChange}
            >
              <option value={1}>'x days ago'</option>
              <option value={2}>'May 1st, 1922'</option>
            </select>
          </div>
        </form>
      </>
    );
  });

  Config.displayName = 'Config';

  return {
    token,
    setToken,
    loadCommits,
    loadCommitsOnlyForAhead,
    showOnlyAheadForks,
    headerAnimation,
    prettyTimeFormat,
    Config,
  };
};

export default useConfig;
