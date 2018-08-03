import React from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import { isEqual } from 'lodash';

const cyStyle = {
  height: '100%',
  width: '100%',
  backgroundColor: '#EEE',
  overflow: 'hidden',
};

const graphStyle = [
  {
    selector: 'node',
    style: {
      label: 'data(label)',
      shape: 'roundrectangle',
      width: '100px',
      color: '#FFF',
      'background-color': '#666',
      'text-valign': 'center',
    },
  },

  {
    selector: 'node:selected',
    style: {
      'background-color': '#38F',
    },
  },

  {
    selector: 'edge',
    style: {
      width: 3,
      'line-color': '#BBB',
      'target-arrow-color': '#BBB',
      'target-arrow-shape': 'triangle',
      'target-arrow-fill': 'filled',
      'arrow-scale': 1,
      'curve-style': 'bezier',
    },
  },
];

cytoscape.use(dagre);

export default class Graph extends React.Component {
  cy = null;

  componentDidMount() {
    this.cy = cytoscape({
      container: this.container,
      style: graphStyle,
      elements: this.props.elements,
      minZoom: 0.25,
      maxZoom: 2.5,
      wheelSensitivity: 0.1,
    });

    this.cy
      .layout({
        name: 'dagre',
        rankDir: 'TB',
        ranker: 'longest-path',
        spacingFactor: 0.9,
        nodeDimensionsIncludeLabels: true,
        animate: true,
        animationEasing: 'ease-in-out-expo',
        animationDuration: 1000,
      })
      .run();
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps, this.props);
  }

  componentDidUpdate(nextProps) {
    this.updateCy(nextProps);
  }

  componentWillUnmount() {
    this.cy.destroy();
  }

  render() {
    return <div style={cyStyle} ref={el => (this.container = el)} />;
  }

  getCy() {
    return this.cy;
  }

  updateCy(props) {
    this.cy.json(this.props);
  }
}
