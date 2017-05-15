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
import {createWikipediaURL, createWikipediaLabel} from 'lib/helpers';
import Measure from 'react-measure';
import Link from '../../Link';
import PeopleViewChronology from './PeopleViewChronology';
import PeopleViewTrajectory from './PeopleViewTrajectory';
import {loadPeopleInfo} from '../../../modules/people';

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

    return (
      <div>
        <h1 className="title">{info.label}</h1>
        <div>
          <strong>Wikipedia pages:</strong>
          {' '}
          {info.availableLanguages.map(lang => {
            const url = createWikipediaURL(lang, info.name);

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
        <PeopleViewInfo title="Wikipedia name" value={info.name} />
        <PeopleViewInfo title="Wikipedia ID" value={info.wikipediaId} />
        <PeopleViewInfo title="Gender" value={info.gender} />
        <PeopleViewInfo title="Pseudo birth date" value={info.pseudoBirthDate} />
        <PeopleViewInfo title="Pseudo death date" value={info.pseudoDeathDate} />
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
        <Measure>
          {dimensions => (
            <div style={{width: '100%'}}>
              <PeopleViewChronology date={info.pseudoBirthDate} dimensions={dimensions} />
            </div>
          )}
        </Measure>
        <h4 className="title is-4">Contact points</h4>
        <PeopleViewTrajectory points={info.paths} />
      </div>
    );
  }
}

export default enhance(PeopleView);
