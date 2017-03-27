/**
 * BHHT Datascape Macro View Top People Component
 * ===============================================
 *
 * Infinite list displaying the top people.
 */
import React from 'react';
import Link from '../../Link';

/**
 * Main component.
 */
export default function MacroViewTopList(props) {
  const {
    data,
    title,
    entityName
  } = props;

  return (
    <div>
      <h2 className="title">{title}</h2>
      <div className="top-list">
        {(data || []).map((line, index) => {
          return (
            <div key={line.name}>
              <Link to={`${entityName}/${line.name}`}>
                {index + 1}. {line.label}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
