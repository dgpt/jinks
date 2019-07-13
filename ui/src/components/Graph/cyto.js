import React from 'react';
import cytoscape from 'cytoscape';
import klay from 'cytoscape-klay';
import edgehandles from 'cytoscape-edgehandles';
import popper from 'cytoscape-popper';
import tippy from 'tippy.js';
import { isEqual, debounce } from 'lodash';
import { colors } from '../../shared/constants';

const cyStyle = {
  height: '100%',
  width: '100%',
  background: 'transparent',
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
      color: colors.text,
      'font-weight': 'bold',
      'background-color': colors.foreground,
      'text-valign': 'center',
      'overlay-padding': '2px',
      'z-index': 100,
    },
  },

  {
    selector: ':selected',
    style: {
      'border-color': colors.text,
      'border-width': '2px',
      'border-style': 'solid',
    },
  },

  {
    selector: 'node[status = "Open"]',
    style: {
      'background-color': colors.issue.open,
    },
  },

  {
    selector: 'node[status = "In Progress"]',
    style: {
      'background-color': colors.issue.inProgress,
    },
  },

  {
    selector: 'node[status *= "QA"]',
    style: {
      'background-color': colors.issue.qa,
    },
  },

  {
    selector: 'node[status = "Closed"]',
    style: {
      'background-color': colors.issue.closed,
    },
  },

  {
    selector: 'edge',
    style: {
      width: 3,
      'line-color': colors.text,
      'target-arrow-color': colors.text,
      'target-arrow-shape': 'triangle',
      'target-arrow-fill': 'filled',
      'arrow-scale': 1,
      'curve-style': 'bezier',
    },
  },

  {
    selector: 'edge:selected',
    style: {
      width: 3,
      'line-color': colors.primary,
      'target-arrow-color': colors.primary,
      'target-arrow-shape': 'triangle',
      'target-arrow-fill': 'filled',
      'arrow-scale': 1,
      'curve-style': 'bezier',
    },
  },

  {
    selector: '.eh-handle',
    style: {
      display: 'none',
    },
  },
];

const layoutSettings = {
  name: 'klay',
  nodeDimensionsIncludeLabels: true,
  animate: true,
  animationEasing: 'ease-in-out',
  animationDuration: 900,
  klay: {
    direction: 'DOWN',
    fixedAlignment: 'BALANCED',
    nodePlacement: 'LINEAR_SEGMENTS',
  }
};

cytoscape.use(klay);
cytoscape.use(edgehandles);
cytoscape.use(popper);

export default class Cyto extends React.Component {
  cy = null;
  layout = null;
  edgehandles = null;
  tooltipsHidden = true;

  static defaultProps = {
    onNewEdge: Function.prototype,
    onSelectNode: Function.prototype,
    onUnselectNode: Function.prototype,
    onSelectEdge: Function.prototype,
    onUnselectEdge: Function.prototype,
  };

  componentDidMount() {
    this.cy = cytoscape({
      container: this.container,
      style: graphStyle,
      elements: this.props.elements,
      minZoom: 0.3,
      maxZoom: 2,
      wheelSensitivity: 0.1,
    });

    this.edgehandles = this.cy.edgehandles({
      edgeType: this.handleEdgeType,
      snap: true,
      snapThreshold: 8,
      preview: false,
    });

    this.edgehandles.enableDrawMode();

    this.cy.on('ehcomplete', this.handleNewEdge);
    this.cy.on('select', 'node', this.onSelectNode.bind(this));
    this.cy.on('unselect', 'node', this.onUnselectNode.bind(this));
    this.cy.on('mouseover', 'node', this.onMouseOver.bind(this));
    this.cy.on('mouseout', 'node', this.onMouseOut.bind(this));
    this.cy.on('select', 'edge', this.onSelectEdge.bind(this));
    this.cy.on('unselect', 'edge', this.onUnselectEdge.bind(this));

    this.cy.layout(layoutSettings).run();
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps.elements, this.props.elements);
  }

  componentDidUpdate(nextProps) {
    this.cy.json(this.props);
    this.cy.layout(layoutSettings).run();
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

  onSelectNode = (event) => {
    const data = event.target.data();
    this.props.onSelectNode(data);
  }

  onUnselectNode = () => {
    this.props.onUnselectNode();
  }

  onSelectEdge = (event) => {
    const data = event.target.data();
    console.log(data);
    this.props.onSelectEdge(data);
  }

  onUnselectEdge = () => {
    this.props.onUnselectEdge();
  }

  onMouseOver = (event) => {
    const node = event.target;
    tippy.hideAll();
    this.tooltipsHidden = false;
    this.showTooltip(node);
  }

  onMouseOut = () => {
    tippy.hideAll();
    this.tooltipsHidden = true;
  }

  handleNewEdge = (event, sourceNode, targetNode) => {
    this.props.onNewEdge(sourceNode.data(), targetNode.data());
    setTimeout(() => (
      this.cy.layout(layoutSettings).run()
    ), 50);
  }

  handleEdgeType = (sourceNode, targetNode) => {
    if (sourceNode.edgesTo(targetNode).length > 0) {
      return null;
    } else {
      return 'flat';
    }
  }

  showTooltip = debounce((node) => {
    if (!this.tooltipsHidden) {
      const data = node.data();
      tippy(node.popperRef(), {
        content: data.summary,
        showOnInit: true,
        arrow: true,
        inertia: true,
      });
    }
  }, 600);
}
