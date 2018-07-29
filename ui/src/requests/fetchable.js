import React from 'react';
import querystring from 'querystring';

const DEFAULT_OPTIONS = {
  props: [],
  path: '',
  method: 'GET',
};

export default function fetchable(Component, options) {
  const apiUrl = process.env.API_URL;

  options = { ...DEFAULT_OPTIONS, ...options };

  if (!apiUrl) {
    throw new Error('FetchError: API_URL not defined in environment!');
  }

  function buildURL(path, query) {
    const parsedQuery = querystring.stringify(query);
    const url = new URL(`${path}?${parsedQuery}`, apiUrl);
    return url.toString();
  }

  return class extends React.PureComponent {
    static propTypes = Component.propTypes;

    constructor(props) {
      super(props);
      this.state = {
        isLoading: false,
        error: null,
        data: [],
      };
    }

    render() {
      const { data, isLoading, error } = this.state;
      /*
      const { props } = options;
      const fetchedProps = props.reduce((obj, prop) => {
        obj[prop] = data[prop];
        return obj;
      }, {});
      */

      return (
        <Component
          data={data}
          fetch={this.fetch.bind(this)}
          isLoading={isLoading}
          error={error}
        >
          {this.renderStatus()}
        </Component>
      );
    }

    renderStatus() {
      const { error, isLoading } = this.state;

      if (error) {
        return <div>Error: {error.message}</div>;
      } else if (isLoading) {
        return <div>Loading...</div>;
      }

      return null;
    }

    fetch(extQuery) {
      const { method, body, path, query } = options;
      const url = buildURL(path, { ...query, ...extQuery });

      this.setState({ isLoading: true });

      return fetch(url, { method, body })
        .then(res => res.json())
        .then(
          data => this.setState({ isLoading: false, data }),
          error => this.setState({ isLoading: false, error })
        );
    }
  };
}
