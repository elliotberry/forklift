import React, {useState, useEffect} from 'react';

import Header from './components/Header.jsx';
import DataTable from './components/DataTable.jsx';
import useConfig from './lib/useConfig';
import SearchInput from './components/Search.jsx';
import useModal from './lib/useModal';
import {Settings} from 'react-feather';
import {Api} from './lib/fork-api.js';
import LoadingBar from './components/LoadingBar.jsx';
import './index.css';
import useError from './lib/useError';
import {getMinutesUntil} from './lib/util.js';

function App() {
  const {Modal, openModal} = useModal();
  const {token, showForkDiffs, prettySizeEnabled, prettyTimeFormat, Config} = useConfig();

  const [loading, setLoading] = useState(false);
  const [loadingReason, setLoadingReason] = useState('');
  const [cancelRequested, setCancelRequested] = useState(null);
  const [rateLimitInfo, setRateLimitInfo] = useState(null);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [tableData, setTableData] = useState([]);

  const [repoDiffInfo, setRepoDiffInfo] = useState([]);
  const [totalForks, setTotalForks] = useState(null);
  const {handleError, Error} = useError();
  const tryCancel = () => {
    setCancelRequested(true);
  };
  useEffect(() => {
    if (repoDiffInfo.length > 0) {
      setTableData(prevTableData =>
        prevTableData.map(fork => {
          let ret = fork;
          try {
            const diff = repoDiffInfo.find(d => d.forkId === fork.forkId);
            ret = diff ? {...fork, diffInfo: diff, commitsList: diff.commitsList, changes: diff.simpleSummary, commitsAhead: diff.ahead_by, commitsBehind: diff.behind_by} : fork;
          } catch  {
            
          }
          return ret;
        }),
      );
    }
  }, [repoDiffInfo]);

  const onRateLimit = obj => {
    setRateLimitInfo(obj);
  };

  async function getDiffs(forks, api) {
    let repoDiffInfo = [];
    let i = 0;
    let totalNumber = forks.length;
    setLoadingReason('Getting fork diff info...');

    await api.getAllDiffs(forks, async function (diff) {
      i++;

      repoDiffInfo = [...repoDiffInfo, diff];
      setRepoDiffInfo(repoDiffInfo);
      setLoadingPercent(((i / totalNumber) * 100).toFixed(1));
      if (cancelRequested === true) {
        console.log('cancel requested');
        setCancelRequested(false);
        return false;
      }
    });
    setLoadingReason('');
    setLoadingPercent(100);
  }
  // setRequestsRemaining(remaining);
  async function startSearch(repoString) {
    let api = await new Api(repoString, token, onRateLimit);
    setLoading(true);
    let forks = await api.getForks(async function (forks) {
    
      setTotalForks(forks.length);
      setTableData(prevTableData => [...prevTableData, ...forks]);
      if (cancelRequested === true) {
        console.log('cancel requested');
        setCancelRequested(false);
        return false;
      }
    });

    setLoading(false);
    setTotalForks(forks.length);
    setTableData(forks);
    let forksToCompare = await api.getForksToCompare(forks);

    getDiffs(forksToCompare, api);
  }

  return (
    <div className="App">
      <div className="container">
        <div className="grid-content bg-purple-dark">
          <Header>
        <button className="settings" onClick={openModal}>
              <Settings />
            </button>
          </Header>
          <Error />
          {rateLimitInfo && (
            <div className="rate-limit-info">
              {rateLimitInfo.remaining} requests remaining / resets in {getMinutesUntil(rateLimitInfo.reset)}m
            </div>
          )}

          {loadingPercent > 0 && loadingPercent < 100 && (
            <div className="diff-loading-info">
              <LoadingBar percentage={loadingPercent} description={loadingReason} />
              <button onClick={tryCancel} className="cancel-button">
                Cancel
              </button>
            </div>
          )}
          <SearchInput setError={handleError} onQueryChange={startSearch} loading={loading} />
        </div>
        {tableData && tableData?.length > 0 && <DataTable showForkDiffs={showForkDiffs} data={tableData} prettySizeEnabled={prettySizeEnabled} prettyTimeFormat={prettyTimeFormat} dataLoading={loading} repoDiffInfo={repoDiffInfo} />}
      </div>
      <Modal>
        <Config />
      </Modal>
    </div>
  );
}

export default App;
