import React from 'react';
import {useParams} from 'react-router-dom';
import {useAsset} from '../assets';
import Separator from './Separator';
import {createWikipediaLabel} from '../../lib/helpers';

export default function People() {
  const params = useParams();

  const top = useAsset('top');

  if (!top) return <div style={{textAlign: 'center'}}>...</div>;

  const data = top.find(p => p.name === params.name);

  // TODO: verify the person exists in the whole dict?

  const title = (
    <h2 style={{textAlign: 'center'}}>
      {createWikipediaLabel(params.name, false)}
    </h2>
  );

  if (!data)
    return (
      <div className="content" style={{textAlign: 'center'}}>
        <Separator />
        {title}
        <p>
          This person exists in the paper's database but is not exposed through
          this website.
          <br />
          Please contact the paper's authors for more information.
        </p>
      </div>
    );

  return (
    <div className="content">
      <Separator />
      {title}
      <div className="columns">
        <div className="column is-3" />
        <div className="column is-6 content">
          <ul style={{listStyleType: 'none'}}>
            <li>
              <strong className="special-red">Birth date</strong> • {data.birth}
            </li>
            {data.death !== null && (
              <li>
                <strong className="special-red">Death date</strong> •{' '}
                {data.death}
              </li>
            )}
            <li>
              <strong className="special-red">Gender</strong> • {data.gender}
            </li>
            <li>
              <strong className="special-red">Occupation</strong> •{' '}
              {data.occupation}
            </li>
            {data.region && (
              <li>
                <strong className="special-red">Region</strong> • {data.region}
              </li>
            )}
            <li>
              <strong className="special-red">Ranking</strong> • {data.ranking}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
