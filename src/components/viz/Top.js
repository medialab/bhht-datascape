import React from 'react';
import debounce from 'react-debounce-render';
import Heap from 'mnemonist/heap';
import meta from '../../../specs/meta.json';
import {createWikipediaLabel} from '../../../lib/helpers';

function comparator(a, b) {
  if (a.ranking < b.ranking) return 1;
  if (a.ranking > b.ranking) return -1;

  return 0;
}

const containerStyle = {
  height: '400px',
  overflowY: 'scroll'
};

const itemStyle = {
  padding: '10px',
  backgroundColor: 'white',
  border: '1px dashed black',
  margin: '5px'
};

function Person({index, data, color}) {
  let dates;

  if (data.death)
    dates = (
      <span>
        ({data.birth} • {data.death})
      </span>
    );
  else dates = <span>({data.birth})</span>;

  return (
    <li style={itemStyle}>
      {index + 1}. <strong>{createWikipediaLabel(data.name, false)}</strong>
      &nbsp;{dates}
      <br />
      <small>
        <em>{data.occupation}</em>
      </small>
    </li>
  );
}

export default debounce(function TopPeople({range, data, colorMap}) {
  if (!data) return <div style={containerStyle}>...</div>;

  // TODO: change this to range intersection
  let top = data.filter(person => {
    return (
      person.birth <= range[1] &&
      (person.death === null ? meta.dates.max : person.death) >= range[0]
    );
  });

  top = Heap.nlargest(comparator, 100, top);

  return (
    <div>
      <ul style={containerStyle}>
        {top.map((person, i) => (
          <Person key={person.name} data={person} index={i} />
        ))}
      </ul>
    </div>
  );
}, 500);
