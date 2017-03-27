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
class LocationView extends Component {
  render() {
    return (
      <h1 className="title">Location View</h1>
    );
  }
}

export default enhance(LocationView);
