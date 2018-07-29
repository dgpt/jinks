import React from 'react';
import * as d3 from 'd3';
//import issueFetchable from '../requests/issueFetchable';
import fetchable from '../requests/fetchable';
import sigma from 'sigma';
import Graph from '../components/graph';
import {Sigma, SigmaEnableWebGL, RandomizeNodePositions, RelativeSize} from 'react-sigma';

class IndexPage extends React.PureComponent {
  render() {
    return (
      <div>
        <button onClick={() => this.fetchData()}>
          Load Epic
        </button>
        {this.props.children}
        {this.props.data && (
          <Sigma graph={this.props.data} settings={{drawEdges: true, clone: false}}>
            <RelativeSize initialSize={15}/>
            <RandomizeNodePositions/>
          </Sigma>
        )}
      </div>
    );
  }

  fetchData() {
    return this.props.fetch(
      { epic: 'BR-18152', type: 'dependent' }
    );
  }
}

export default fetchable(IndexPage, { path: 'issues' });
