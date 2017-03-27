/**
 * BHHT Datascape Application Component
 * =====================================
 *
 * Root component of the application.
 */
import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'recompose';
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
    dispatch => {
      return {};
    }
  )
);

function Application({view}) {
  const Component = MAP[view];

  return (
    <div id="application">
      <div className="container is-fluid">
        <Component />
      </div>
    </div>
  );
}

export default enhance(Application);
