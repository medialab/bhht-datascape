import React from 'react';
import urljoin from 'url-join';

export default function Figure({name, legend}) {
  const url = urljoin(BASE_URL, 'public', name);

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
