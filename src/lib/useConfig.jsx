import React from 'react';
import useLocalStorage from 'use-local-storage';
import './Config.scss';
const useConfig = () => {
  const [token, setToken] = useLocalStorage('token', '');
  const Config = () => {
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
              onChange={e => {
                setToken(e.target.value);
              }}
            />
            <label for="token">Github token</label>
          </div>
        </form>
      </>
    );
  };
  return {
    token,

    Config,
  };
};

export default useConfig;
