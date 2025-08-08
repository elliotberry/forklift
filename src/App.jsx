import React, {useState, useEffect, useMemo} from 'react';
import PropTypes from 'prop-types';

import Header from './components/Header.jsx';
import DataTable from './components/DataTable.jsx';
import useConfig from './lib/useConfig';
import SearchInput from './components/Search.jsx';
import useModal from './lib/useModal';
import {Api} from './lib/fork-api.js';
import LoadingBar from './components/LoadingBar.jsx';
import './App.scss';
import useError from './lib/useError';
import {getMinutesUntil, measureAsyncPerformance, logMemoryUsage} from './lib/util.js';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h3>Something went weird</h3>
          <p>Please try refreshing?</p>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  const {Modal, openModal} = useModal();
  const {token, showForkDiffs, prettySizeEnabled, prettyTimeFormat, loadCommits, headerAnimation, crazyMode, Config} = useConfig();

  const [loading, setLoading] = useState(false);
  const [loadingReason, setLoadingReason] = useState('');
  const [cancelRequested, setCancelRequested] = useState(null);
  const [rateLimitInfo, setRateLimitInfo] = useState(null);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [tableData, setTableData] = useState([]);

  const [repoDiffInfo, setRepoDiffInfo] = useState([]);
  const [diffMap, setDiffMap] = useState(new Map());
  const {handleError, Error} = useError();
  
  const tryCancel = () => {
    setCancelRequested(true);
  };

  // Memoized diff map for O(1) lookups
  useEffect(() => {
    if (repoDiffInfo.length > 0 && repoDiffInfo[0]?.id) {
      console.log(repoDiffInfo);
      const newDiffMap = new Map();
      repoDiffInfo.forEach(diff => {
        console.log(`Adding diff for fork ID: ${diff}`);
        newDiffMap.set(diff.id, diff);
      });
      setDiffMap(newDiffMap);
    }
  }, [repoDiffInfo]);

  // Memoized table data with diff info
  const enhancedTableData = useMemo(() => {
    return tableData.map(fork => {
      const diff = diffMap.get(fork.forkId);
      if (diff) {
        return {
          ...fork,
          diffInfo: diff,
          commitsList: diff.commitsList,
          changes: diff.simpleSummary,
          commitsAhead: diff.ahead_by,
          commitsBehind: diff.behind_by
        };
      }
      return fork;
    });
  }, [tableData, diffMap]);

  const onRateLimit = obj => {
    setRateLimitInfo(obj);
  };

  async function getDiffs(forks, api) {
    return measureAsyncPerformance('getDiffs', async () => {
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
    });
  }

  async function startSearch(repoString) {
    return measureAsyncPerformance('startSearch', async () => {
      try {
        logMemoryUsage('Before search');
        
        let api = await new Api(repoString, token, onRateLimit);
        setLoading(true);
        setTableData([]);
        setRepoDiffInfo([]);
        setDiffMap(new Map());
        setCancelRequested(false);
        
        let forks = await api.getForks(async function (forks) {
          if (cancelRequested === true) {
            console.log('cancel requested');
            setCancelRequested(false);
            return false;
          }
          // Only update if we're still loading (not cancelled)
          setTableData(prevTableData => [...prevTableData, ...forks]);
        });

        setLoading(false);
        setTableData(forks);
        
        // Only load diffs if the setting is enabled
        if (loadCommits) {
          let forksToCompare = await api.getForksToCompare(forks);
          await getDiffs(forksToCompare, api);
        } else {
          console.log('Skipping diff loading as per user preference');
        }
        
        logMemoryUsage('After search');
      } catch (error) {
        console.error('Search failed:', error);
        setLoading(false);
        handleError(`Search failed: ${error.message}`);
      }
    });
  }

  return (
    <ErrorBoundary>
      <div className="App">
        <div className="container">
          <div className="grid-content bg-purple-dark">
            <Header headerAnimation={headerAnimation} crazyMode={crazyMode}>
              <button className="settings" onClick={openModal}>
                <img src="./settings.svg" alt="Settings" />
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
          {enhancedTableData && enhancedTableData?.length > 0 && (
            <DataTable 
              showForkDiffs={showForkDiffs} 
              data={enhancedTableData} 
              prettySizeEnabled={prettySizeEnabled} 
              prettyTimeFormat={prettyTimeFormat} 
              dataLoading={loading} 
              repoDiffInfo={repoDiffInfo} 
            />
          )}
        </div>
        <Modal>
          <Config />
        </Modal>
      </div>
    </ErrorBoundary>
  );
}

export default App;
