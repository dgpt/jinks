import React from 'react';
import Cyto from './cyto';

export default class Graph extends React.PureComponent {
  render() {
    return <Cyto {...this.props} />;
  }
}
