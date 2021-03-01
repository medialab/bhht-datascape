import React from 'react';

export default function Anchor({id}) {
  return (
    <a className="anchor" href={`#${id}`} style={{fontSize: '0.6em'}}>
      ❦
    </a>
  );
}
