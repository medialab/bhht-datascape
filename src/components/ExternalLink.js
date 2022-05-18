import React from 'react';

export default function ({href, children}) {
  return (
    <a href={href} target="_blank" rel="noreferrer noopener">
      {React.Children.count(children) ? children : href}
    </a>
  );
}
