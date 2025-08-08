import React from 'react';
import useLocalStorage from 'use-local-storage';
import './Config.scss';

const useConfig = () => {
  const [token, setToken] = useLocalStorage('token', '');
  const [loadCommits, setLoadCommits] = useLocalStorage('loadCommits', true);
  const [headerAnimation, setHeaderAnimation] = useLocalStorage('headerAnimation', true);
  const [debug, setDebug] = useLocalStorage('debug', false);
  
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
    Config,
  };
};

export default useConfig;
