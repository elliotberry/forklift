import React from 'react';

import './Header.scss';
function DumbHeader({ children }) {
  return (
    <header>
      {children}
      <div className="title-container">
    
        <h1>forklift</h1>
        <h3>a slightly better github fork network view</h3>
      </div>

      <div className="area">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </header>
  );
}
export default DumbHeader;
