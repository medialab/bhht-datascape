import React from 'react';
import Anchor from './Anchor';

export default function SectionTitle({id, children}) {
  return (
    <h2
      id={id}
      style={{
        borderBottom: '1px solid black',
        fontSize: '2em',
        marginBottom: '25px'
      }}>
      {children} <Anchor id={id} />
    </h2>
  );
}
