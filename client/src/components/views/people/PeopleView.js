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

/**
 * Connector.
 */
const enhance = compose(
  connect(
    state => {
      return {

      };
    },
    dispatch => {
      return {
        actions: bindActionCreators({

        }, dispatch)
      };
    }
  )
);

/**
 * Main component.
 */
class PeopleView extends Component {
  render() {
    return (
      <h1 className="title">People View</h1>
    );
  }
}

export default enhance(PeopleView);
