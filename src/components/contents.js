import React from 'react';
import SectionTitle from './SectionTitle';
import ExternalLink from './ExternalLink';

export function Papers() {
  return (
    <>
      <SectionTitle id="papers">Papers</SectionTitle>
      <div className="content" style={{fontSize: '1.1em'}}>
        <ul>
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

export function About() {}
