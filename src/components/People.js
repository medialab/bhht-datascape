import React from 'react';
import {useParams} from 'react-router-dom';
import {useAsset} from '../assets';
import Separator from './Separator';
import ExternalLink from './ExternalLink';
import {createWikipediaLabel} from '../../lib/helpers';

function PeopleProperty({label, value}) {
  if (value === null || value === undefined) return null;

  return (
    <li>
      <strong className="special-red">{label}</strong> • {value}
    </li>
  );
}

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

  const wikidataUrl = `https://www.wikidata.org/wiki/${data.wikidata_code}`;

  return (
    <div className="content">
      <Separator />
      {title}
      <div style={{textAlign: 'center', marginBottom: '20px'}}>
        <ExternalLink href={wikidataUrl}>{wikidataUrl}</ExternalLink>
      </div>
      <div className="columns">
        <div className="column is-2" />
        <div className="column is-8 content">
          <ul style={{listStyleType: 'none'}}>
            <PeopleProperty label="Birth date" value={data.birth} />
            <PeopleProperty label="Death date" value={data.death} />
            <PeopleProperty label="Gender" value={data.gender} />
            <PeopleProperty label="Occupation" value={data.occupation} />
            <PeopleProperty label="Region" value={data.region} />
            <PeopleProperty label="Ranking" value={data.ranking} />
            <PeopleProperty label="Citizenship" value={data.citizenship} />
            <PeopleProperty label="Wikidata code" value={data.wikidata_code} />
          </ul>
        </div>
      </div>
    </div>
  );
}