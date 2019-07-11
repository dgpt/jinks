import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Header from 'components/Header';
import './index.css';
import { canvas } from '@instructure/ui-themes';
canvas.use();

const title = "Jinks = Jira + Links";

const Layout = ({ children }) => {
  return (
    <div style={{ height: '100vh', overflowY: 'hidden' }}>
      <Helmet
        title={title}
        meta={[
          { name: 'description', content: 'Sample' },
          { name: 'keywords', content: 'sample, something' },
        ]}
      />
      <Header siteTitle={title} />
      <div
        style={{
          margin: '0 auto',
          maxWidth: '100%',
          padding: '0px 1.45rem',
          paddingTop: 0,
          nBottom: '1rem',
          height: '85%',
        }}
      >
        {children}
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
