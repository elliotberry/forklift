import React, {useEffect} from 'react';
import "./Error.scss";
const useError = () => {
  const [error, setError] = React.useState(``);

  const [active, setActive] = React.useState(false);
  useEffect(() => {
    if (error.toLowerCase().trim().length > 0) {
      setActive(true);
      setTimeout(() => {
        setActive(false);
        setTimeout(() => {
          setError(' ');
        }, 3000);
      }, 6000);
    }
  }, [error]);

  const handleError = error => {

    setError(error);
  };
  const Error = () => {
  
    return   <>{error !=="" ? <div className={`little-error ${active ? `is--active` : `is--inactive`}`}>Error: {error}</div> : null}</>;
  };
  return {handleError, Error};
};

export default useError;
