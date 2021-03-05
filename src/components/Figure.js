import React from 'react';
import {getPublicUrl} from '../helpers';

export default function Figure({name, legend, notes, maxHeight = '450px'}) {
  const url = getPublicUrl(name);

  return (
    <div style={{textAlign: 'center', marginBottom: '20px'}}>
      <a href={url}>
        <img alt={name} src={url} style={{maxWidth: '90%', maxHeight}} />
      </a>
      <p style={{marginTop: '10px'}}>
        <em>{legend}</em>
      </p>
      <p style={{fontSize: '0.85em'}}>
        <em>{notes}</em>
      </p>
    </div>
  );
}
