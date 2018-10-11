import React from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import edgehandles from 'cytoscape-edgehandles';
import popper from 'cytoscape-popper';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { isEqual, debounce } from 'lodash';

const cyStyle = {
  height: '100%',
  width: '100%',
  backgroundColor: '#FFF',
  overflow: 'hidden',
};

const graphStyle = [
  {
    selector: 'core',
    style: {
      'active-bg-size': '9',
    },
  },

  {
    selector: 'node',
    style: {
      label: 'data(label)',
      shape: 'roundrectangle',
      width: '100px',
      height: '50px',
      color: '#FFF',
      'font-weight': 'bold',
      'background-color': '#484850',
      'text-valign': 'center',
      'overlay-padding': '2px',
      'z-index': 100,
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
      events: 'no',
    },
  },

  {
    selector: '.eh-handle',
    style: {
      display: 'none',
    },
  },
];

cytoscape.use(dagre);
cytoscape.use(edgehandles);
cytoscape.use(popper);

export default class Cyto extends React.Component {
  cy = null;
  layout = null;
  edgehandles = null;

  static defaultProps = {
    onNewEdge: Function.prototype,
    onSelectNode: Function.prototype,
    onUnselectNode: Function.prototype,
  };

  componentDidMount() {
    this.cy = cytoscape({
      container: this.container,
      style: graphStyle,
      elements: this.props.elements,
      minZoom: 0.4,
      maxZoom: 2,
      wheelSensitivity: 0.1,
    });

    this.edgehandles = this.cy.edgehandles({
      edgeType: this.handleEdgeType,
      snap: true,
      preview: false,
    });

    this.edgehandles.enableDrawMode();

    this.layout = this.cy.layout({
      name: 'dagre',
      rankDir: 'TB',
      ranker: 'longest-path',
      spacingFactor: 0.9,
      nodeDimensionsIncludeLabels: true,
      animate: true,
      animationEasing: 'ease-in-out-expo',
      animationDuration: 1000,
    });

    this.cy.on('ehcomplete', this.handleNewEdge);
    this.cy.on('select', 'node', this.onSelectNode.bind(this));
    this.cy.on('unselect', 'node', this.onUnselectNode.bind(this));
    this.cy.on('mouseover', 'node', this.onMouseOver.bind(this));
    this.cy.on('mouseout', 'node', this.onMouseOut.bind(this));
    this.layout.run();
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

  getCy = () => {
    return this.cy;
  }

  updateCy = (props) => {
    this.cy.json(this.props);
  }

  onSelectNode = (event) => {
    const data = event.target.data();
    this.props.onSelectNode(data);
  }

  onUnselectNode = () => {
    this.props.onUnselectNode();
  }

  onMouseOver = (event) => {
    const node = event.target;
    tippy.hideAllPoppers();
    this.showTooltip(node);
  }

  onMouseOut = () => {
    tippy.hideAllPoppers();
  }

  handleNewEdge = (sourceNode, targetNode) => {
    const { onNewEdge } = this.props;
    onNewEdge && onNewEdge(sourceNode, targetNode);
  }

  handleEdgeType = (sourceNode, targetNode) => {
    if (sourceNode.edgesTo(targetNode).length > 0) {
      return null;
    } else {
      return 'flat';
    }
  }

  showTooltip = debounce((node) => {
    const data = node.data();
    tippy.one(node.popperRef(), {
      content: data.summary,
      showOnInit: true,
      arrow: true,
      inertia: true,
    });
  }, 300);
}
