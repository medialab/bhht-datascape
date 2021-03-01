import React from 'react';
import SectionTitle from './SectionTitle';
import ExternalLink from './ExternalLink';

function Ref({id, children}) {
  return (
    <a href={`#${id}`}>
      <em>{children}</em>
    </a>
  );
}

export function Papers() {
  return (
    <>
      <SectionTitle id="papers">Papers</SectionTitle>
      <div className="content large">
        <ul style={{listStyleType: 'none'}}>
          <li>
            Version 1.0:{' '}
            <em>
              <strong>
                <ExternalLink href="https://ideas.repec.org/p/spo/wpecon/infohdl2441-h4tv2ee028raq0ib4dabsqqei.html">
                  A Brief History of Human Time: Exploring a database of
                  'notable people'
                </ExternalLink>
              </strong>
            </em>
          </li>
          <li>
            Version 2.0:{' '}
            <em>
              <strong>
                <ExternalLink href="https://cepr.org/active/publications/discussion_papers/dp.php?dpno=15852">
                  A Cross-verified Database of Notable People, 3500BC-2018AD
                </ExternalLink>
              </strong>
            </em>
          </li>
        </ul>
      </div>
    </>
  );
}

export function About() {
  return (
    <>
      <SectionTitle id="about">About</SectionTitle>
      <div className="content">
        <p>
          <ExternalLink href="https://cepr.org/active/publications/discussion_papers/dp.php?dpno=15852">
            Our most recent paper
          </ExternalLink>{' '}
          develops a cross-verified database of 2.2 million notable individuals
          using several Wikipedia editions and Wikidata.
        </p>
        <p>
          This approach was pioneered by{' '}
          <Ref id="schich">Schich et al. (2014)</Ref> who focused on lifetime
          mobility of 150,000 notable individuals across centuries and
          continents using all available birth and death data found in Freebase,
          a Google-owned knowledge database. <Ref id="yu">Yu et al. (2016)</Ref>{' '}
          also used Freebase and the English edition of Wikipedia to assemble a
          manually-verified database of 11,341 individuals present in more than
          25 language editions of Wikipedia called Pantheon 1.0. For larger
          databases, the fast-growing verification cost currently prevents
          scientists from considering in a satisfactory way less prominent
          individuals, who may however have had a significant impact at a more
          local level. See for instance Yago (
          <Ref id="tanon">Tanon et al. (2020)</Ref>, the second version of
          Pantheon (2.0) in{' '}
          <Ref id="jara">Jara-Figueroa and Hidalgo (2019)</Ref> and a recent
          independent work by <Ref id="nekoei">Nekoei and Sinn (2020)</Ref>.
        </p>
        <p>
          Our approach complements existing approaches in several ways. First,
          we collect a massive amount of data that leads to several
          cross-verifications. It is based on multiple sources (various editions
          of Wikipedia and Wikidata) and deduplication techniques. The
          combination of Wikipedia and Wikidata brings 2.72% new birth dates,
          8.16% new occupations and 17.16% new citizenships. We find that there
          are very few errors in the part of the database that contains the most
          documented individuals. We also find non trivial error rates (around
          1%) in the bottom part of the notability distribution, due to sparse
          information and classification errors or ambiguity. This either
          requires manual corrections for future use or a statistical treatment
          of these errors in statistical approaches. The combination of
          Wikipedia and Wikidata corrects about 0.5% of errors. One therefore
          needs to trade-off the size of the database and the precision of the
          data.
        </p>
        <p>
          Second, we adopt a social science approach: data collection is driven
          by specific social questions on gender, economic and cultural
          development and quantitative exploration of cultural trends that we
          document in this paper. This approach is used in particular to
          document the Anglo-Saxon bias naturally present in existing projects
          based on the English edition of Wikipedia.
        </p>
        <p>
          This strategy results in a cross-verified database of 2.2 million
          unique individuals (we do not recommend to go beyond given the errors
          in the extended database of 4.7 million people. We also add a large
          fraction of newly-added individuals from non-English editions of
          Wikipedia who actually played a significant role in important periods
          of human history. There are more than 700,000 such individuals, almost
          a third of the database we verified.
        </p>
        <p>
          Such projects represent promising developments for the Social
          Sciences. A good example is illustrated by{' '}
          <Ref id="serafinelli">Serafinelli and Tabellini (2017)</Ref> (see
          related Vox column) who analyzed the historical development of cities
          and relate it to the emergence of a creative class using{' '}
          <Ref id="schich">Schich et al. (2014)</Ref> or{' '}
          <Ref id="croix">de la Croix and Licandro (2015)</Ref>
          and our previous work in its 1.0. version in{' '}
          <Ref id="gergaud">Gergaud et al. (2016)</Ref>.
        </p>
        <p>
          We welcome comments on our approach, and point towards this website to
          obtain the data, or extended requests.
        </p>
      </div>
    </>
  );
}

function Author({name, affiliation, page}) {
  return (
    <li>
      <ExternalLink href={page}>
        <strong>{name}</strong>
      </ExternalLink>
      &nbsp;-&nbsp;<em>{affiliation}</em>
    </li>
  );
}

const AUTHORS = [
  {
    name: 'Morgane Laouenan',
    affiliation: "CNRS, Centre d'Economie de la Sorbonne and LIEPP-Sciences Po",
    page: 'https://www.sciencespo.fr/liepp/user/502'
  },
  {
    name: 'Palaash Bhargava',
    affiliation: 'Columbia University',
    page: 'https://sites.google.com/view/palaashbhargava'
  },
  {
    name: 'Jean-Benoit Eymeoud',
    affiliation: 'LIEPP-Sciences Po',
    page: 'https://sites.google.com/site/jeanbenoiteymeoud/'
  },
  {
    name: 'Olivier Gergaud',
    affiliation: 'KEDGE Business School and LIEPP-Sciences Po',
    page: 'http://olivier.gergaud.free.fr/'
  },
  {
    name: 'Guillaume Plique',
    affiliation: 'médialab-Sciences Po',
    page: 'https://medialab.sciencespo.fr/en/people/guillaume-plique/'
  },
  {
    name: 'Etienne Wasmer',
    affiliation: 'NYU Abu Dhabi and LIEPP-Sciences Po',
    page: 'https://sites.google.com/site/etiennewasmer/'
  }
];

export function Authors() {
  return (
    <>
      <SectionTitle id="authors">Authors</SectionTitle>
      <div className="content large">
        <ul>
          {AUTHORS.map(author => (
            <Author key={author.name} {...author} />
          ))}
        </ul>
      </div>
    </>
  );
}
