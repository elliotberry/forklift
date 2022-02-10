import React from 'react';
import PropTypes from 'prop-types';
import './LoadingBar.scss'; // Import CSS for styling

const LoadingBar = ({ percentage=30, description="" }) => {
  return (
    <div className="loading-bar-container-outer">
    <div className="loading-bar-container">
      <div
        className="loading-bar-fill"
        style={{ width: `${percentage}%` }}
      />
      <div className="loading-bar-text">{percentage}%</div>
     
    </div>
    <div className="loading-bar-description">{description}</div>
    </div>
  );
};

// Define PropTypes
LoadingBar.propTypes = {
  percentage: PropTypes.number.isRequired,
};

export default LoadingBar;