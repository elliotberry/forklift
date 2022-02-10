import React, {useEffect} from 'react';

import './dumb-button.scss';
const ButtonWithLoader = ({children, onClick, ...props}) => {
  const [loading, setLoading] = React.useState(false);
  const [outcome, setOutcome] = React.useState(null);
  
  const handleClick = async () => {
    setLoading(true);
    let res = await onClick();
    if (res && res.success) {
      setLoading(false);
      setOutcome(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (outcome) {
      setTimeout(() => {
        setOutcome(null);
      }, 3000);
    }
  }, [outcome]);
  const Loader = ({loading}) => {
    return <span className={`loader ${loading ? 'loading' : 'not-loading'}`}></span>;
  };

  return (
    <>
      <button className={`loader-button ${loading ? 'is--loading' : ''}`} onClick={handleClick} {...props}>
        <Loader loading={loading} />
        {outcome && <span className="outcome">{outcome ? 'Success' : 'Failed'}</span>}
        <span className={`child-zone ${loading || outcome !== null ? 'loading-child' : ''}`}>{children}</span>
      </button>
    </>
  );
};
export default ButtonWithLoader;
