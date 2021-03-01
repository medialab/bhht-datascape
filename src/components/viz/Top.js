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
  overflowY: 'scroll',
  borderBottom: '1px solid black',
  borderTop: '1px solid black'
};

const itemStyle = {
  padding: '10px',
  backgroundColor: 'white',
  border: '1px dashed black',
  margin: '5px'
};

function Person({index, data, onClick}) {
  let dates;

  if (data.death)
    dates = (
      <span>
        ({data.birth} • {data.death})
      </span>
    );
  else dates = <span>({data.birth})</span>;

  return (
    <li style={itemStyle} onClick={() => onClick(data.name)}>
      {index + 1}.{' '}
      <strong className="special-red" style={{cursor: 'pointer'}}>
        {createWikipediaLabel(data.name, false)}
      </strong>
      &nbsp;{dates}
      <br />
      <small>
        <em>{data.occupation}</em>
      </small>
    </li>
  );
}

export default debounce(function TopPeople({range, data, onSelect}) {
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
    <>
      <h3 style={{marginTop: '20px', fontSize: '1.8em'}}>Notable People</h3>
      <div>
        <ul style={containerStyle}>
          {top.map((person, i) => (
            <Person
              key={person.name}
              data={person}
              index={i}
              onClick={onSelect}
            />
          ))}
        </ul>
      </div>
    </>
  );
}, 500);
