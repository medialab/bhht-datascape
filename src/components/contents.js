import React from 'react';
import SectionTitle from './SectionTitle';
import ExternalLink from './ExternalLink';
import Figure from './Figure';
import Separator from './Separator';
import {getPublicUrl} from '../helpers';

function Ref({id, children}) {
  return <a href={`#${id}`}>{children}</a>;
}

function Citation({children}) {
  return (
    <blockquote
      style={{
        fontSize: '0.85em',
        padding: '10px',
        fontStyle: 'italic',
        marginBottom: '20px'
      }}>
      {children}
    </blockquote>
  );
}

function BibTexCitation({code}) {
  return <pre style={{fontSize: '0.6em'}}>{code.trim()}</pre>;
}

const FIRST_PAPER_BIBTEX = `
@TECHREPORT{gergaud2017brief,
  title = {A Brief History of Human Time: Exploring a database of 'notable people'},
  author = {Gergaud, Olivier and Laouenan, Morgane and Wasmer, Etienne},
  year = {2016},
  institution = {Sciences Po Departement of Economics},
  type = {Sciences Po Economics Discussion Papers},
  number = {2016-03},
  url = {https://EconPapers.repec.org/RePEc:spo:wpecon:info:hdl:2441/h4tv2ee028raq0ib4dabsqqei}
}
`;

export function Papers() {
  return (
    <>
      <SectionTitle id="papers">Papers</SectionTitle>
      <div className="content large">
        <ul style={{listStyleType: 'none'}}>
          <li>
            Version 1.0 (2016):{' '}
            <em>
              <strong>
                <ExternalLink href="https://ideas.repec.org/p/spo/wpecon/infohdl2441-h4tv2ee028raq0ib4dabsqqei.html">
                  A Brief History of Human Time: Exploring a database of
                  'notable people'
                </ExternalLink>
              </strong>
            </em>
            <Citation>
              Gergaud O., Laouennan M., Wasmer, E. (2016) A Brief History of
              Human Time: Exploring a database of 'notable people, Sciences Po
              Economics Discussion Papers, 2016-03
            </Citation>
            <BibTexCitation code={FIRST_PAPER_BIBTEX} />
          </li>
          <li>
            Version 2.0 (2021):{' '}
            <em>
              <strong>
                <ExternalLink href="https://cepr.org/active/publications/discussion_papers/dp.php?dpno=15852">
                  A Cross-verified Database of Notable People, 3500BC-2018AD
                </ExternalLink>
              </strong>
            </em>
            <Citation>
              Morgane Laouenan, Palaash Bhargava, Jean-Benoît Eyméoud, Olivier
              Gergaud, Guillaume Plique, Etienne Wasmer (2021) A Cross-verified
              Database of Notable People, 3500BC-2018AD, CEPR discussion paper
              15582, Feb. 2021
            </Citation>
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
          Since the time Plutarch’s Parallel Lives was written in the beginning
          of the second century AD and his 23 biographies have survived two
          thousand years (or even more ancient, the Epic of Gilgamesh dates back
          to 2000 BC), the task of registering famous individuals and their
          influence has been a recurrent field of study. Over the last few
          years, this task has been undertaken to a much larger scale, with a
          growing number of databases documenting history, allowing statistical
          analysis of socio-historical facts, at a scale that had never been
          reached so far.
        </p>
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
          independent work by <Ref id="nekoei">Nekoei and Sinn (2020)</Ref>).
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

const REFERENCES = [
  {
    id: 'croix',
    text:
      'de la Croix, D. and O. Licandro (2015): “The longevity of famous people from Hammurabi to Einstein,” Journal of Economic Growth, 20, 263–303.'
  },
  {
    id: 'gergaud',
    text:
      'Gergaud, O., M. Laouenan, and E. Wasmer (2016): “A Brief History of Human Time: Exploring a database of ’notable people’,” Sciences Po Economics Discussion Papers 2016-03, Sciences Po Departement of Economics. '
  },
  {
    id: 'jara',
    text:
      'Jara-Figueroa, Christian, Y. A. and C. Hidalgo (2019): “How the medium shapes the message: Printing and the rise of the arts and sciences,” Plos One, 14(2): e0205771. '
  },
  {
    id: 'nekoei',
    text:
      'Nekoei, Arash and Sinn, Fabian, Human Biographical Record (HBR) (December 2, 2020). Available at SSRN: https://ssrn.com/abstract=3741450'
  },
  {
    id: 'schich',
    text:
      'Schich, M., C. Song, Y.-Y. Ahn, A. Mirsky, M. Martino, A.-L. Barabási, and D. Helbing (2014): “A network framework of cultural history,” Science, 345, 558–562. '
  },
  {
    id: 'serafinelli',
    text:
      'Serafinelli, M. and G. Tabellini (2017): “Creativity over time and space,” Available at SSRN 3070203. '
  },
  {
    id: 'tanon',
    text:
      'Tanon, T. P., G. Weikum, and F. Suchanek (2020): “YAGO 4: A Reason-able Knowledge Base,” in European Semantic Web Conference, Springer, 583–596. '
  },
  {
    id: 'yu',
    text:
      'Yu, A. Z., S. Ronen, K. Hu, T. Lu, and C. A. Hidalgo (2016): “Pantheon 1.0, a manually verified dataset of globally famous biographies,” Scientific data, 3, 150075. '
  }
];

export function References() {
  return (
    <>
      <SectionTitle id="references">References</SectionTitle>
      <div className="content">
        <ul>
          {REFERENCES.map(ref => (
            <li key={ref.id} id={ref.id} style={{marginBottom: '20px'}}>
              <em>{ref.text}</em>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export function Files() {
  return (
    <>
      <SectionTitle id="database">Sample &amp; database</SectionTitle>
      <div className="content large">
        <p>
          You can download a random sample out of <code>100k</code> records of
          the ~<code>3.2M</code> individuals found in the full database by
          clicking on the following link:&nbsp;
          <a href={getPublicUrl('bhht-100k-sample.csv.gz')}>
            bhht-100k-sample.csv.gz
          </a>
          <Citation>
            BHHT database (100 000 obs. random sample) from Morgane Laouenan,
            Jean-Benoît Eyméoud, Olivier Gergaud, Palaash Bhargava, Guillaume
            Plique, Etienne Wasmer (2021) A Cross-verified Database of Notable
            People, 3500BC-2018AD, CEPR discussion paper 15582, Feb. 2021,
            available from https://medialab.github.io/bhht-datascape/
          </Citation>
        </p>
        <p>
          To request an access to the full database, for questions and
          enquiries, please contact us by sending an email to{' '}
          <code>5000yearsbhht@gmail.com</code>.
        </p>
      </div>
    </>
  );
}

export function Figures() {
  return (
    <>
      <SectionTitle id="figures">Figures</SectionTitle>
      <div className="content">
        <Figure
          name="fig1.png"
          legend="Fig. 1. Cloud of the most famous individuals in the database"
          notes="Size is proportional to relative notability level. The cloud focuses on the 3,000 most visible individuals (0.06% of the exhaustive sample). Colors represent the domain of influence defined later in the text (see Figures 5 and 6 for labels, e.g. green is culture, red is politics, blue is academia, etc.)."
        />
        <Separator />
        <Figure
          name="fig2.png"
          legend="Fig. 2 Relation between the most frequent Wikipedia editions and sources used to document the biography"
          notes="Sample restricted to individuals with only one biography in Wikipedia. We consider the 10 most frequent external sources and 10 most popular Wikipedia language editions, and merge the rest into other sources."
          maxHeight={500}
        />
        <Separator />
        <Figure
          name="fig3.png"
          legend="Fig 3. Sunburst: relative importance of the main occupations and domains of influence"
          notes="Restricted database (at least one Wikipedia edition among the 7 European languages analyzed)."
          maxHeight={600}
        />
        <Separator />
        <Figure
          name="fig4.png"
          legend="Fig 4. Share of individuals present in the database in any given year, breakdown by domain of influence"
          notes="Restricted sample (at least one Wikipedia edition among the 7 European languages analyzed). Imputed life time when missing."
        />
        <Separator />
        <Figure
          name="fig5.png"
          legend="Fig 5. Evolution of the number of individuals associated with “politics”, 1400-2000AD"
          notes="Restricted sample (at least one Wikipedia edition among the 7 European languages analyzed).  Most popular citizenships (share of living individuals on the vertical axis, year on the horizontal axis)."
        />
        <Separator />
        <Figure
          name="fig6.png"
          legend="Fig 6. Age at death on Western non-English editions (right chart), 1800-2000AD"
          notes="Restricted sample (at least one Wikipedia edition among the 7 European languages analyzed). A vertical line corresponds to the distribution of the age at death for a given date. The observed colors discontinuity illustrates wars episodes: First World War, Spanish Civil War, and Second World War."
        />
        <Separator />
        <Figure
          name="figadd1.png"
          legend="Additional Fig 1. Women in Wikipedia or Wikidata by sphere of influence"
          notes="The spheres of influence have, among others, the following color codes: culture:green, academic:blue, invention/exploration/development:light blue, sport:purple, business:brown, politics:light brown, religion:grey, administration/law:burgundy, nobility:red."
        />
      </div>
    </>
  );
}
