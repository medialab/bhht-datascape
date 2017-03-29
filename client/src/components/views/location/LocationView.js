/* eslint react/jsx-no-bind: 0 */
/**
 * BHHT Datascape Location View Component
 * =======================================
 *
 * Component rendering a single location's information page.
 */
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import {createWikipediaURL} from 'lib/helpers';
import WorldMap from '../../WorldMap';
import {loadLocationInfo} from '../../../modules/location';

/**
 * Connector.
 */
const enhance = compose(
  connect(
    state => {
      return {
        name: state.router.params.name,
        loading: state.location.loadingInfo,
        info: state.location.info
      };
    },
    dispatch => {
      return {
        actions: bindActionCreators({
          loadLocationInfo
        }, dispatch)
      };
    }
  )
);

/**
 * Main component.
 */
class LocationView extends Component {
  componentDidMount() {
    const {
      actions,
      name
    } = this.props;

    actions.loadLocationInfo(name);
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

    const markers = [
      {
        key: name,
        position: [
          +info.position.lat,
          +info.position.lon
        ],
        label: info.label
      }
    ];

    const url = createWikipediaURL('en', info.name);

    return (
      <div>
        <h1 className="title">{info.label}</h1>
        <p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer">
            {url}
          </a>
        </p>
        <p>
          {info.position.lat}, {info.position.lon}
        </p>
        <WorldMap
          center={markers[0].position}
          markers={markers} />
      </div>
    );
  }
}

export default enhance(LocationView);
