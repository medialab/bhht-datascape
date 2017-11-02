/* eslint react/jsx-no-bind: 0 */
/**
 * BHHT Datascape People View Component
 * =====================================
 *
 * Component rendering a single person's information page.
 */
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import {format} from 'd3-format';
import {createWikipediaURL, createWikipediaLabel} from 'lib/helpers';
// import Measure from 'react-measure';
import Link from '../../Link';
// import PeopleViewChronology from './PeopleViewChronology';
import PeopleViewTrajectory from './PeopleViewTrajectory';
import {loadPeopleInfo} from '../../../modules/people';
import {formatDate, formatLifetime} from '../../../helpers';

import LABELS from 'specs/labels.json';

/**
 * Formats.
 */
const NUMBER_FORMAT = format(',');

/**
 * Connector.
 */
const enhance = compose(
  connect(
    state => {
      return {
        name: state.router.params.name,
        loading: state.people.loadingInfo,
        info: state.people.info
      };
    },
    dispatch => {
      return {
        actions: bindActionCreators({
          loadPeopleInfo
        }, dispatch)
      };
    }
  )
);

/**
 * Helper components.
 */
function PeopleViewInfo({title, value}) {
  return (
    <p>
      <strong>{title}:</strong> {value}
    </p>
  );
}

/**
 * Main component.
 */
class PeopleView extends Component {
  componentDidMount() {
    const {
      actions,
      name
    } = this.props;

    actions.loadPeopleInfo(name);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.name !== this.props.name && this.props.name)
      this.props.actions.loadPeopleInfo(nextProps.name);
  }

  render() {
    const {
      loading,
      info
    } = this.props;

    if (loading || !info)
      return <div>Loading...</div>;

    const isAlive = info.dead ? 'No' : 'Yes';

    const names = {};

    for (const lang in info.links) {
      const name = createWikipediaLabel(info.links[lang]);

      names[name] = names[name] || [];
      names[name].push(lang);
    }

    // const chronology = (
    //   <Measure>
    //     {dimensions => (
    //       <div style={{width: '100%'}}>
    //         <PeopleViewChronology date={info.estimatedBirthDate} dimensions={dimensions} />
    //       </div>
    //     )}
    //   </Measure>
    // );

    return (
      <div>
        <h1 className="title">
          {info.label}
          <small> ({formatLifetime(info)})</small>
        </h1>
        <div>
          <strong>Wikipedia pages:</strong>
          {' '}
          {info.availableLanguages.map(lang => {
            const url = createWikipediaURL(lang, info.links[lang]);

            return (
              <span key={lang}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer">
                  {lang}
                </a>
                {' '}
              </span>
            );
          })}
        </div>
        <PeopleViewInfo title="Distinct Names" value={Object.keys(names).map(name => `${name} (${names[name].join(', ')})`).join(' - ')} />
        <PeopleViewInfo title="Gender" value={info.gender} />
        <PeopleViewInfo title="Category" value={LABELS.categories[info.category]} />
        <PeopleViewInfo title="SubCategory" value={LABELS.subcategories[info.subcategory]} />
        <PeopleViewInfo title="Birth date" value={formatDate(info.birthDatePrecision, info.birth)} />
        <PeopleViewInfo title="Death date" value={formatDate(info.deathDatePrecision, info.death)} />
        <PeopleViewInfo title="Estimated birth date" value={info.estimatedBirthDate} />
        <PeopleViewInfo title="Estimated death date" value={info.estimatedDeathDate} />
        <PeopleViewInfo title="Alive" value={isAlive} />
        <PeopleViewInfo title="Translations" value={info.languagesCount} />
        {info.birthLocation &&
          <PeopleViewInfo
            title="Birth place"
            value={<Link to={`/location/${info.birthLocation}`}>{createWikipediaLabel(info.birthLocation)}</Link>} />}
        {info.deathLocation &&
          <PeopleViewInfo
            title="Death place"
            value={<Link to={`/location/${info.deathLocation}`}>{createWikipediaLabel(info.deathLocation)}</Link>} />}
        <hr />
        <h4 className="title is-4">Notoriety</h4>
        {Object.keys(info.notoriety).map(lang => {

          const rank = info.ranking[lang],
                max = info.maxNotoriety[lang];

          const percentage = (rank * 100) / max,
                percentile = Math.ceil(percentage / 1) * 1;

          return (
            <div key={lang} style={{width: '50%'}}>
              <strong>{lang}</strong> Top {percentile}%
              &nbsp;(<em>{NUMBER_FORMAT(info.ranking[lang])}</em> on <em>{NUMBER_FORMAT(info.maxNotoriety[lang])}</em>)
            </div>
          );
        })}
        <hr />
        <h4 className="title is-4">Occupations</h4>
        {info.occupations.map(occupation => (
          <div key={occupation.order}>
            {occupation.order}. <strong>{LABELS.categories[occupation.category]}</strong> (<em>{LABELS.subcategories[occupation.subcategory]}</em>)
          </div>
        ))}
        <hr />
        <h4 className="title is-4">Contact points</h4>
        {(info.paths && !!info.paths.length) ?
          <PeopleViewTrajectory points={info.paths} /> :
          (<p><em>This person does not have contact points.</em></p>)}
      </div>
    );
  }
}

export default enhance(PeopleView);
