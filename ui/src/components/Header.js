import React from 'react';
import Link from 'gatsby-link';
import { colors } from '../shared/constants';

const Header = ({ siteTitle }) => (
  <div
    style={{
      background: colors.primary,
    }}
  >
    <div
      style={{
        margin: '0 auto',
        maxWidth: 960,
        padding: '0.5rem 1.8rem',
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: colors.text,
            textDecoration: 'none',
          }}
        >
          {siteTitle}
        </Link>
      </h1>
    </div>
  </div>
);

export default Header;
