/**
 * BHHT Datascape Lang Queries
 * ============================
 *
 * Helpers used to create the complex filters required by the `languages` mode.
 */

/**
 * Function returning `bool` query members for the given language.
 */
function createBoolQueryMembersForLang(lang) {

  if (lang === 'multiWithEn')
    return [
      {
        range: {
          availableLanguagesCount: {
            gt: 1
          }
        }
      },
      {
        term: {
          availableLanguages: 'en'
        }
      }
    ];

  if (lang === 'multiWithoutEn')
    return [
      {
        range: {
          availableLanguagesCount: {
            gt: 1
          }
        }
      },
      {
        bool: {
          must_not: {
            term: {
              availableLanguages: 'en'
            }
          }
        }
      }
    ];

  return [
    {
      range: {
        availableLanguagesCount: {
          lt: 2
        }
      }
    },
    {
      term: {
        availableLanguages: lang
      }
    }
  ];
}

/**
 * Function returning a bool query for the given language.
 */
function createBoolQueryForLang(lang) {
  return {
    bool: {
      must: createBoolQueryMembersForLang(lang)
    }
  };
}

/**
 * Exporting.
 */
exports.createBoolQueryMembersForLang = createBoolQueryMembersForLang;
exports.createBoolQueryForLang = createBoolQueryForLang;
