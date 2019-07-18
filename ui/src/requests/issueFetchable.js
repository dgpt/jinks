import React from 'react';
import fetchable from 'requests/fetchable';

function parseIssueResponse(data) {
  const nodes = data.nodes
    ? data.nodes.map(node => ({
        group: 'nodes',
        data: node,
      }))
    : [];

  const edges = data.edges
    ? data.edges.map(edge => ({
        group: 'edges',
        data: edge,
      }))
    : [];

  return [...nodes, ...edges];
}

export default function issueFetchable(Component) {
  class IssueRequests extends React.PureComponent {
    render() {
      return (
        <Component
          {...this.props}
          createLink={this.createLink}
          deleteLink={this.deleteLink}
          fetchIssues={this.fetchIssues}
        />
      );
    }

    fetchIssues = ({ epic, type }) => {
      type = type || 'dependent';

      return this.props.fetch({
        path: '/issues',
        query: { epic, type },
        setData: true
      });
    }

    createLink = ({ from, to, type }) => {
      const { setData, data } = this.props;

      if (!(from && to)) return;
      type = type || 'dependent';

      return this.props.fetch({
        path: '/links',
        method: 'POST',
        body: {
          from: from.label,
          to: to.label,
          type
        },
      }).then(newEdges => this.props.setData(
        [ ...data, ...newEdges ]
      ));
    }

    deleteLink = ({ id, type }) => {
      if (!id) return;
      type = type || 'dependent';

      const newData = this.props.data.filter(d => (
        d.data.id !== id
      ));
      console.log('old', this.props.data, 'new', newData);

      this.props.setData(newData);

      return this.props.fetch({
        path: `/links/${id.replace('e', '')}`,
        method: 'DELETE',
        body: { type }
      });
    }
  }

  return fetchable(IssueRequests, {
    parse: parseIssueResponse
  });
}
