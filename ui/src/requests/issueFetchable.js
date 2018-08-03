import React from 'react';
import fetchable from './fetchable';

export default function issueFetchable(Component) {
  return fetchable(Component, {
    path: '/issues',
    method: 'GET',
    parse(data) {
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
    },
  });
}
