import React, {useState, useEffect, useMemo, useCallback, useRef} from 'react';

import Header from './components/Header.jsx';
import DataTable from './components/DataTable.jsx';
import useConfig from './lib/useConfig';
import SearchInput from './components/Search.jsx';
import useModal from './lib/useModal';
import {Api} from './lib/fork-api.js';
import LoadingBar from './components/LoadingBar.jsx';
import ErrorBoundary from './components/Error-Boundary.jsx';
import useError from './lib/useError';
import {getMinutesUntil, measureAsyncPerformance, logMemoryUsage} from './lib/util.js';

import './App.scss';

function App() {
  const {Modal, openModal} = useModal();
  const {
    token,
    setToken,
    prettyTimeFormat,
    loadCommits,
    loadCommitsOnlyForAhead,
    showOnlyAheadForks,
    headerAnimation,
    Config,
  } = useConfig();

  const [loading, setLoading] = useState(false);
  const [loadingReason, setLoadingReason] = useState('');
  const [cancelRequested, setCancelRequested] = useState(null);
  const [rateLimitInfo, setRateLimitInfo] = useState(null);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [tableData, setTableData] = useState([]);

  const [repoDiffInfo, setRepoDiffInfo] = useState([]);
  const [diffMap, setDiffMap] = useState(new Map());
  const {handleError, Error} = useError();
  
  // Refs for cleanup and cancellation
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  const tryCancel = useCallback(() => {
    setCancelRequested(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);


  // Memoized diff map for O(1) lookups
  useEffect(() => {
    if (repoDiffInfo.length > 0 && repoDiffInfo[0]?.forkId) {
      const newDiffMap = new Map();
      repoDiffInfo.forEach(diff => {
        if (diff && diff.forkId) {
          newDiffMap.set(diff.forkId, diff);
        }
      });
      setDiffMap(newDiffMap);
    }
  }, [repoDiffInfo]);
  
  // Validate token on load
  useEffect(() => {
    const validateToken = async () => {
      if (!token?.trim()) return;
      try {
        const response = await fetch('https://api.github.com/user', {
          headers: { authorization: `token ${token.trim()}` },
        });
        if (response.status === 401) {
          handleError('GitHub token is invalid or no longer works. It has been removed from settings.');
          setToken('');
        }
      } catch {
        // Network error - don't delete token, validation can retry on next load
      }
    };
    validateToken();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- run only on mount

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Memoized table data with diff info
  const enhancedTableData = useMemo(() => {
    const mergedTableData = tableData.map(fork => {
      const diff = diffMap.get(fork.forkId);
      if (diff) {
        return {
          ...fork,
          diffInfo: diff,
          commitsList: diff.commitsList,
          changes: diff.simpleSummary,
          commitsAhead: diff.ahead_by,
          commitsBehind: diff.behind_by,
        };
      }
      return fork;
    });

    if (!showOnlyAheadForks) {
      return mergedTableData;
    }

    return mergedTableData.filter(fork => (fork.commitsAhead || 0) > 0);
  }, [tableData, diffMap, showOnlyAheadForks]);

  const onRateLimit = useCallback(obj => {
    setRateLimitInfo(obj);
  }, []);

  const getDiffs = useCallback(async (forks, api, options = {}) => {
    const {loadCommitsOnlyForAhead = false, showOnlyAheadForks = false, loadCommits = true} = options;

    return measureAsyncPerformance('getDiffs', async () => {
      let repoDiffInfo = [];
      let i = 0;
      let totalNumber = forks.length;
      
      setLoadingReason('Getting fork diff info...');

      await api.getAllDiffs(forks, async function (diff) {
        
        i++;

        // Only add non-null diffs to the array
        if (diff) {
          const shouldKeepDiff = !showOnlyAheadForks || diff.ahead_by > 0;
          const normalizedDiff = loadCommits ? diff : {...diff, commitsList: []};

          if (shouldKeepDiff) {
            repoDiffInfo = [...repoDiffInfo, normalizedDiff];
            setRepoDiffInfo(prev => [...prev, normalizedDiff]);
          }
        }
        
        setLoadingPercent(((i / totalNumber) * 100).toFixed(1));
        
        if (cancelRequested === true) {
          console.log('cancel requested');
          setCancelRequested(false);
          return false;
        }
      }, loadCommitsOnlyForAhead);
      
      setLoadingReason('');
      setLoadingPercent(100);
    });
  }, [cancelRequested]);

  const startSearch = useCallback(async (repoString) => {
    console.log('startSearch called with:', repoString);
    return measureAsyncPerformance('startSearch', async () => {
      try {
        // Cancel any existing request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        
        // Create new abort controller
        abortControllerRef.current = new AbortController();
        
        logMemoryUsage('Before search');

        let api = await new Api(repoString, token, onRateLimit, abortControllerRef.current);
        
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
          if (!showOnlyAheadForks) {
            // Only update if we're still loading (not cancelled)
            setTableData(prevTableData => [...prevTableData, ...forks]);
          }
        });
        
        setLoading(false);
        setTableData(forks);

        const shouldFetchDiffs = loadCommits || showOnlyAheadForks;

        // Load diffs when commits are enabled, or when we need ahead-only filtering.
        if (shouldFetchDiffs) {
          let forksToCompare = await api.getForksToCompare(forks);
          await getDiffs(forksToCompare, api, {
            loadCommitsOnlyForAhead: loadCommitsOnlyForAhead || showOnlyAheadForks,
            showOnlyAheadForks,
            loadCommits,
          });
        } else {
          console.log('Skipping diff loading as per user preference');
        }

        logMemoryUsage('After search');
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Search was cancelled');
          return;
        }
        console.error('Search failed:', error);
        setLoading(false);
        handleError(`Search failed: ${error.message}`);
      }
    });
  }, [token, onRateLimit, loadCommits, loadCommitsOnlyForAhead, showOnlyAheadForks, getDiffs, handleError, cancelRequested]);

  return (
    <ErrorBoundary>
      <div className="App">
        <div className="container">
          <div className="grid-content bg-purple-dark">
            <Header headerAnimation={headerAnimation}>
              <div className="settings-container">
                
                <button className={`settings ${!token?.trim() ? 'settings--warning' : ''}`} onClick={openModal}>
                  <img src="./settings.svg" alt="Settings" />
                </button>
              </div>
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

          {enhancedTableData.length > 0 && !loading && (
            <div className="fork-count">
              {enhancedTableData.length} fork{enhancedTableData.length !== 1 ? 's' : ''} found
            </div>
          )}

          {enhancedTableData && enhancedTableData?.length > 0 && <DataTable data={enhancedTableData} prettyTimeFormat={prettyTimeFormat} dataLoading={loading} repoDiffInfo={repoDiffInfo} />}
        </div>
        <Modal>
          <Config />
        </Modal>
      </div>
    </ErrorBoundary>
  );
}

export default App;
