import PropTypes from 'prop-types';

import './Header.scss';

function DumbHeader({ children, headerAnimation = true }) {
  return (
    <header className={headerAnimation ? 'animated' : 'not-animated'}>
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

DumbHeader.propTypes = {
  children: PropTypes.node,
  headerAnimation: PropTypes.bool,
};

export default DumbHeader;
