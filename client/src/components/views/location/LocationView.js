/* eslint react/jsx-no-bind: 0 */
/**
 * BHHT Datascape Location View Component
 * =======================================
 *
 * Component rendering a single location's information page.
 */
import React, {Component} from 'react';
import Measure from 'react-measure';
import {bindActionCreators} from 'redux';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import {createWikipediaLabel} from 'lib/helpers';
import WorldMap from '../../WorldMap';
import Link from '../../Link';
import LocationViewFrequentationChart from './LocationViewFrequentationChart';
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
 * Helper components.
 */
function LocationViewInfo({title, value}) {
  return (
    <p>
      <strong>{title}:</strong> {value}
    </p>
  );
}

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
      this.props.actions.loadLocationInfo(nextProps.name);
  }

  render() {
    const {
      loading,
      info
    } = this.props;

    if (loading || !info)
      return <div>Loading...</div>;

    const hasCoordinates = !!info.position;

    let markers;

    if (hasCoordinates) {
      markers = [
        {
          key: name,
          position: [
            +info.position.lat,
            +info.position.lon
          ],
          label: info.label
        }
      ];
    }

    return (
      <div>
        <h1 className="title">{info.label}</h1>
        <div>
          <LocationViewInfo title="Available languages" value={info.availableLanguages.join(', ')} />
        </div>
        <hr />
        <h4 className="title is-4">Aliases</h4>
        <div className="content">
          <ul>
            {info.aliases.map(alias => {
              return (
                <li key={alias}>{createWikipediaLabel(alias)}</li>
              );
            })}
          </ul>
        </div>
        <hr />
        {info.instance && (
          <div>
            <h4 className="title is-4">Instance of</h4>
            <div className="content">
              <ul>
                {info.instance.map(label => {
                  return <li key={label}>{label}</li>;
                })}
              </ul>
            </div>
            <Link to="/meta/distinct-instance-values">
              <em>
                Display distinct entities existing in the database
              </em>
            </Link>
            <hr />
          </div>
        )}
        <h4 className="title is-4">Frequentation</h4>
        <Measure style={{height: '150px'}}>
          {dimensions => {
            return (
              <div style={{width: '100%'}}>
                <LocationViewFrequentationChart
                  dimensions={dimensions}
                  values={info.frequentation} />
              </div>
            );
          }}
        </Measure>
        {hasCoordinates && (
          <div>
            <hr />
            <h4 className="title is-4">Map</h4>
            <WorldMap
              center={markers[0].position}
              markers={markers} />
            <hr />
          </div>
        )}
      </div>
    );
  }
}

export default enhance(LocationView);
