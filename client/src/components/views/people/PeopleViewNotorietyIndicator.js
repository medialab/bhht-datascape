/**
 * BHHT Datascape People View Notoriety Indicator Component
 * =========================================================
 *
 * Component displaying a person's notoriety as a completion indicator.
 */
import React from 'react';

export default function PeopleViewNotorietyIndicator(props) {
  const {
    notoriety,
    max
  } = props;

  return (
    <progress className="progress is-small" max={max} value={notoriety}>
      {notoriety}
    </progress>
  );
}
