/**
 * BHHT Datascape API Client Helpers
 * ==================================
 *
 * Miscellaneous helper functions.
 */

/**
 * Count inflector for the english language.
 */
function countInflector(i) {
  i = Math.abs(i);

  const teenth = (i % 100);

  if (teenth > 10 && teenth < 14)
    return 'th';

  switch (i % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

/**
 * Function formatting a person's birth or death date.
 */
export function formatDate(precision, date) {
  if (precision === 'century')
    return `${date}${countInflector(date)} century`;

  if (precision === 'circa')
    return `~${date}`;

  return date;
}

/**
 * Function formatting a person's lifetime.
 */
export function formatLifetime(person) {
  let lifetime = '';

  if (person.birth)
    lifetime += formatDate(person.birthDatePrecision, person.birth);
  else
    lifetime += '?';

  if (person.death) {
    lifetime += ' • ' + formatDate(person.deathDatePrecision, person.death);
  }
  else if (person.dead) {
    lifetime += ' • ?';
  }

  return lifetime;
}
