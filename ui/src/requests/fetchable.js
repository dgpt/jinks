import React from 'react';
import querystring from 'querystring';

const DEFAULT_OPTIONS = {
  props: [],
  path: '',
  method: 'GET',
  parse: data => data,
  setData: false
};

export default function fetchable(Component, globalOptions) {
  const apiUrl = process.env.API_URL;

  globalOptions = { ...DEFAULT_OPTIONS, ...globalOptions };

  if (!apiUrl) {
    throw new Error('FetchError: API_URL not defined in environment!');
  }

  function buildURL(path, query) {
    const parsedQuery = querystring.stringify(query);
    const fullQuery = parsedQuery ? `?${parsedQuery}` : ''
    const url = new URL(path + fullQuery, apiUrl);
    return url.toString();
  }

  return class extends React.PureComponent {
    static propTypes = Component.propTypes;

    constructor(props) {
      super(props);
      this.state = {
        isLoading: false,
        error: null,
        data: null,
      };
    }

    render() {
      const { data, isLoading, error } = this.state;

      return (
        <Component
          data={data}
          fetch={this.fetch}
          setData={this.setData}
          isLoading={isLoading}
          error={error}
        />
      );
    }

    setData = (data) => {
      this.setState({ data });
    }

    fetch = (options) => {
      this.setState({ isLoading: true });

      options = { ...globalOptions, ...options };
      const {
        method, body, path,
        query, setData, parse
      } = options;

      const url = buildURL(path, query);
      return fetch(url, { method, body: JSON.stringify(body) })
        .then(res => res.json())
        .then(
          data => {
            let state = { isLoading: false };
            if (setData && parse) {
              state.data = parse(data);
            }
            return this.setState(state);
          },
          error => this.setState({ isLoading: false, error })
        );
    }
  };
}
