/**
 * BHHT Datascape Macro View Top People Component
 * ===============================================
 *
 * Infinite list displaying the top people.
 */
import React from 'react';
import Link from '../../Link';
import {formatLifetime} from '../../../helpers';

import LABELS from 'specs/labels.json';

/**
 * People item.
 */
export function MacroViewTopListPeopleItem({rank, link, item}) {
  return (
    <div className="top-list-item">
      <Link to={link}>
        {rank}.&nbsp;
        <strong>
          {item.label}
        </strong>
        &nbsp;({item.gender === 'Female' ? 'F' : 'M'})
        <small> ({formatLifetime(item)})</small>
        {item.category && (
          <span>
            <br />
            <em><small>{LABELS.categories[item.category]} § {LABELS.subcategories[item.subcategory]}</small></em>
          </span>
        )}
      </Link>
    </div>
  );
}

/**
 * Location item.
 */
function MacroViewTopListLocationItem({rank, link, item}) {
  return (
    <div className="top-list-item">
      <Link to={link}>
        {rank}.&nbsp;
        <strong>
          {item.label}
        </strong>
      </Link>
    </div>
  );
}


/**
 * Main component.
 */
export default function MacroViewTopList(props) {
  const {
    data,
    title,
    entityName
  } = props;

  const ItemComponent = entityName === 'people' ?
    MacroViewTopListPeopleItem :
    MacroViewTopListLocationItem;

  return (
    <div>
      <h2 className="title">{title}</h2>
      <div className="top-list">
        {(data || []).map((line, index) => {
          return (
            <ItemComponent
              key={line.name}
              link={`${entityName}/${line.name}`}
              rank={index + 1}
              item={line} />
          );
        })}
      </div>
    </div>
  );
}
