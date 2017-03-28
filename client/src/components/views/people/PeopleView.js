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
import Link from '../../Link';
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
                <a href={url} target="_blank">{lang}</a>
                {' '}
              </span>
            );
          })}
        </div>
        <PeopleViewInfo title="Wikipedia name" value={info.name} />
        <PeopleViewInfo title="Wikipedia ID" value={info.wikipediaId} />
        <PeopleViewInfo title="Gender" value={info.gender} />
        <PeopleViewInfo title="Alive" value={isAlive} />
        <PeopleViewInfo title="Translations" value={info.languagesCount} />
        {info.birthPlace &&
          <PeopleViewInfo
            title="Birth place"
            value={<Link to={`location/${info.birthPlace}`}>{createWikipediaLabel(info.birthPlace)}</Link>} />}
        {info.deathPlace &&
          <PeopleViewInfo
            title="Death place"
            value={<Link to={`location/${info.deathPlace}`}>{createWikipediaLabel(info.deathPlace)}</Link>} />}
      </div>
    );
  }
}

export default enhance(PeopleView);
