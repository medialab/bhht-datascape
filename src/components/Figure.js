import React from 'react';
import {getPublicUrl} from '../helpers';

export default function Figure({name, legend}) {
  const url = getPublicUrl(name);

  return (
    <div style={{textAlign: 'center', marginBottom: '20px'}}>
      <a href={url}>
        <img
          alt={name}
          src={url}
          style={{maxWidth: '90%', maxHeight: '450px'}}
        />
      </a>
      <p>
        <em>{legend}</em>
      </p>
    </div>
  );
}
