/**
 * BHHT Datascape Macro View Top People Component
 * ===============================================
 *
 * Infinite list displaying the top people.
 */
import React from 'react';
import Infinite from 'react-infinite';

/**
 * Main component.
 */
export default function MacroViewTopList(props) {
  const {
    data
  } = props;

  return (
    <Infinite containerHeight={200} elementHeight={20}>
      {data.map(line => {
        return (
          <div key={line.name}>{line.label}</div>
        );
      })}
    </Infinite>
  );
}
