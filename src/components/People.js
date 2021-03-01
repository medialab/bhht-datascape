import React from 'react';
import {useAsset} from '../assets';
import ExternalLink from './ExternalLink';
import {createWikipediaLabel} from '../../lib/helpers';

function PeopleProperty({label, value, isUrl = false}) {
  if (value === null || value === undefined) return null;

  if (isUrl) value = <ExternalLink href={value}>{value}</ExternalLink>;

  return (
    <li>
      <strong className="special-red">{label}</strong> • {value}
    </li>
  );
}

export default function People({name, onReset}) {
  const top = useAsset('top');

  if (!top) return <div style={{textAlign: 'center'}}>...</div>;

  const data = top.find(p => p.name === name);

  // TODO: verify the person exists in the whole dict?

  const title = (
    <h3 style={{marginTop: '20px', fontSize: '1.8em'}}>
      {createWikipediaLabel(name, false)}
    </h3>
  );

  const backToTheList = (
    <p className="content">
      <em
        onClick={onReset}
        style={{textDecoration: 'underline', cursor: 'pointer'}}>
        Back to the list of notable people
      </em>
    </p>
  );

  if (!data)
    return (
      <>
        {title}
        <div style={{borderTop: '1px solid black'}} className="content">
          <p style={{marginTop: '20px'}}>
            <em>
              This person exists in the paper's database but the attached
              metadata is not exposed through this website.
            </em>
            <br />
            <br />
            <em>Please contact the paper's authors for more information.</em>
          </p>
          {backToTheList}
        </div>
      </>
    );

  const wikidataUrl = `https://www.wikidata.org/wiki/${data.wikidata_code}`;

  return (
    <>
      {title}
      <div style={{borderTop: '1px solid black'}} className="content">
        <ul style={{listStyleType: 'none', marginLeft: '0px'}}>
          <PeopleProperty label="Wikidata url" value={wikidataUrl} isUrl />
          <PeopleProperty label="Birth date" value={data.birth} />
          <PeopleProperty label="Death date" value={data.death} />
          <PeopleProperty label="Gender" value={data.gender} />
          <PeopleProperty label="Occupation" value={data.occupation} />
          <PeopleProperty label="Region" value={data.region} />
          <PeopleProperty label="Ranking" value={data.ranking} />
          <PeopleProperty label="Citizenship" value={data.citizenship} />
          <PeopleProperty label="Wikidata code" value={data.wikidata_code} />
        </ul>
        {backToTheList}
      </div>
    </>
  );
}
