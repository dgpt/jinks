import React from 'react';
import Cyto from './cyto';

export default class Graph extends React.Component {
  render() {
    return <Cyto {...this.props} />;
  }
}
