import React from 'react';
import sigma from 'sigma';

export default class Graph extends React.PureComponent {
  static defaultProps = {
    data: []
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.data.length !== this.props.data.length;
  }

  componentDidUpdate() {

  }

  componentDidMount() {
    let s = new sigma({
      renderers: [
        { type: 'webgl', container: 'graph' }
      ],
    });
    s.graph.read(this.props.data)

    s.settings({
      edgeColor: 'default',
      defaultEdgeColor: '#999'
    });

    s.refresh()
  }

  render() {
    return (
      <div style={{width: "100%", height: "100%", position: "absolute" }} id="graph"></div>
    )
  }
}
