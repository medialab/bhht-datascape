import React from 'react';

export default function Anchor({id}) {
  return (
    <a className="anchor" href={`#${id}`}>
      ❦
    </a>
  );
}
