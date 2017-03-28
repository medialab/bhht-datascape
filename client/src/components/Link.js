/**
 * BHHT Datascape Link Component
 * ==============================
 *
 * Link referring to the internal routing scheme.
 */
import React from 'react';
import path from 'path';

export default function Link(props) {
  const {
    to,
    ...rest
  } = props;

  const href = path.resolve('/#/', to);

  return (
    <a href={href} className="link" {...rest}>
      {props.children}
    </a>
  );
}
