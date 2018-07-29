import React from 'react';
import fetchable from './fetchable';

export default function issueFetchable(Component) {
  return fetchable(Component, {
    path: '/issues',
    method: 'GET',
    props: [ 'issues', 'links' ]
  });
}
