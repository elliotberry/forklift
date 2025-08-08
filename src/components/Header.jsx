import PropTypes from 'prop-types';

import './Header.scss';

function Header({ children, headerAnimation = true, crazyMode = false }) {
  const headerClasses = [];
  
  if (headerAnimation) {
    headerClasses.push('animated');
    if (crazyMode) {
      headerClasses.push('crazy');
    }
  } else {
    headerClasses.push('not-animated');
  }

  return (
    <header className={headerClasses.join(' ')}>
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

Header.propTypes = {
  children: PropTypes.node,
  headerAnimation: PropTypes.bool,
  crazyMode: PropTypes.bool,
};

export default Header;
