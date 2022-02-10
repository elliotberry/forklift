import React from 'react';
import {Layout} from 'element-react';

const Information = ({loadingReason, Children, totalForks, forksDifferent, tableData}) => {
  return (
    <>
      <Layout.Row>
        {Children}
        <div className="small">
          {loadingReason !== "" ? <div>Loading: {loadingReason}</div> : <div>Not loading.</div>}
          {totalForks && <div>{totalForks} forks found.</div>}
          {tableData.length > 0 && <div>{tableData.length} repositories found.</div>}
          {forksDifferent !== null && <div>{forksDifferent} forks have different sizes or updates.</div>}
        </div>
      </Layout.Row>
    </>
  );
};
export default Information;
