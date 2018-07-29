import React from 'react';

const IssueList = ({ issues }) => (
  <div>{issues.map(i => i.key).join(', ')}</div>
);

export default IssueList;
