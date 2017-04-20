/**
 * BHHT Datascape Application Component
 * =====================================
 *
 * Root component of the application.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import Link from './Link';
import FuzzySearcher from './FuzzySearcher';
import MacroView from './views/macro/MacroView';
import PeopleView from './views/people/PeopleView';
import LocationView from './views/location/LocationView';

/**
 * View map.
 */
const MAP = {
  macro: MacroView,
  people: PeopleView,
  location: LocationView
};

/**
 * Main component.
 */
const enhance = compose(
  connect(
    state => {
      return {
        view: state.router.view
      };
    },
    () => {
      return {};
    }
  )
);

class Application extends Component {
  getChildContext() {
    return {
      history: this.props.history
    };
  }

  render() {
    const {view} = this.props;

    const RouteComponent = MAP[view];

    return (
      <div id="application">
        <nav className="nav">
          <div className="nav-left">
            <Link className="nav-item" to="/">
              BHHT Datascape
            </Link>
          </div>
          <div className="nav-center">
            <div className="nav-item">
              <FuzzySearcher
                entityName="people"
                placeholder="Search a person..."
                style={{marginRight: '10px'}} />
              <FuzzySearcher
                entityName="location"
                placeholder="Search a location..." />
            </div>
          </div>
          <div className="nav-right" />
        </nav>
        <div className="container is-fluid">
          <RouteComponent />
        </div>
      </div>
    );
  }
}

Application.propTypes = {
  history: PropTypes.object.isRequired
};

Application.childContextTypes = {
  history: PropTypes.object.isRequired
};

export default enhance(Application);
