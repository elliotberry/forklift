import React from 'react';
import useLocalStorage from 'use-local-storage';
import './Config.scss';

const useConfig = () => {
  const [token, setToken] = useLocalStorage('token', '');
  const [loadCommits, setLoadCommits] = useLocalStorage('loadCommits', true);
  const [headerAnimation, setHeaderAnimation] = useLocalStorage('headerAnimation', true);
  const [debug, setDebug] = useLocalStorage('debug', false);
  const [showForkDiffs, setShowForkDiffs] = useLocalStorage('showForkDiffs', true);
  const [prettySizeEnabled, setPrettySizeEnabled] = useLocalStorage('prettySizeEnabled', true);
  const [prettyTimeFormat, setPrettyTimeFormat] = useLocalStorage('prettyTimeFormat', 1);
  
  const Config = React.memo(() => {
    const handleTokenChange = React.useCallback((e) => {
      setToken(e.target.value);
    }, [setToken]);

    const handleLoadCommitsChange = React.useCallback((e) => {
      setLoadCommits(e.target.checked);
    }, [setLoadCommits]);

    const handleHeaderAnimationChange = React.useCallback((e) => {
      setHeaderAnimation(e.target.checked);
    }, [setHeaderAnimation]);

    const handleDebugChange = React.useCallback((e) => {
      setDebug(e.target.checked);
    }, [setDebug]);

    const handleShowForkDiffsChange = React.useCallback((e) => {
      setShowForkDiffs(e.target.checked);
    }, [setShowForkDiffs]);

    const handlePrettySizeEnabledChange = React.useCallback((e) => {
      setPrettySizeEnabled(e.target.checked);
    }, [setPrettySizeEnabled]);

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
          <div className="field">
            <input
              placeholder="github token"
              value={token}
              name="token"
              type="text"
              onChange={handleTokenChange}
            />
            <label htmlFor="token">Github token</label>
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
          <div className="field checkbox-field">
            <input
              id="showForkDiffs"
              name="showForkDiffs"
              type="checkbox"
              checked={showForkDiffs}
              onChange={handleShowForkDiffsChange}
            />
            <label htmlFor="showForkDiffs">Show fork diffs</label>
          </div>
          <div className="field checkbox-field">
            <input
              id="prettySizeEnabled"
              name="prettySizeEnabled"
              type="checkbox"
              checked={prettySizeEnabled}
              onChange={handlePrettySizeEnabledChange}
            />
            <label htmlFor="prettySizeEnabled">Pretty size format</label>
          </div>
          <div className="field">
            <select
              value={prettyTimeFormat}
              onChange={handlePrettyTimeFormatChange}
            >
              <option value={1}>Time format 1</option>
              <option value={2}>Time format 2</option>
            </select>
            <label htmlFor="prettyTimeFormat">Time format</label>
          </div>
          <div className="field checkbox-field">
            <input
              id="debug"
              name="debug"
              type="checkbox"
              checked={debug}
              onChange={handleDebugChange}
            />
            <label htmlFor="debug">Debug mode</label>
          </div>
        </form>
      </>
    );
  });

  Config.displayName = 'Config';
  
  return {
    token,
    loadCommits,
    headerAnimation,
    debug,
    showForkDiffs,
    prettySizeEnabled,
    prettyTimeFormat,
    Config,
  };
};

export default useConfig;
