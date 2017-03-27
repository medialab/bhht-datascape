/**
 * BHHT Datascape Macro View Top People Component
 * ===============================================
 *
 * Infinite list displaying the top people.
 */
import React from 'react';

/**
 * Main component.
 */
export default function MacroViewTopList(props) {
  const {
    data
  } = props;

  return (
    <div>
      {data.map(line => {
        return (
          <div key={line.name}>{line.label}</div>
        );
      })}
    </div>
  );
}
