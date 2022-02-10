import React from "react";
import {Checkbox } from "element-react";

import AwesomeDebouncePromise from "awesome-debounce-promise";
//https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line
const Config = ({
  token,
  setToken,
  showForkDiffs,
  setShowForkDiffs,
  prettySizeEnabled,
  setPrettySizeEnabled,
}) => {
  
  const onChangeToken = (e) => {
    setToken(e.target.value);
  };
  const onChangeSettings = (e) => {
    console.log(e);
  };

  const onChangeTokenDB = AwesomeDebouncePromise(onChangeToken, 300);

  const onChangePrettySize = AwesomeDebouncePromise(async (e) => {
    setPrettySizeEnabled(e);
  }, 300);

  const onChangeShowForkDiffs = AwesomeDebouncePromise(async (e) => {
    setShowForkDiffs(e);
  }, 300);
  return (
    <>
      <form
        inline={true}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
      
          <input
            placeholder="github token"
            value={token}
            name="token"
            type="password" 
            onChange={onChangeTokenDB}
          />
          <span className="small">
            You can get a token from
            https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line
          </span>
       
          <Checkbox
            name="showForkDiffs"
            onChange={onChangeShowForkDiffs}
            checked={showForkDiffs}
            label={`Get commit fork diff info (requires more requests)`}
          />

          <Checkbox
            onChange={onChangePrettySize}
            name="prettySizeEnabled"
            checked={onChangeSettings}
            label={`Enable human-readble repo byte sizes`}
          />
       
      </form>
    </>
  );
};

export default Config;
