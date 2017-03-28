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

  render() {
    const {
      loading,
      info
    } = this.props;

    if (loading || !info)
      return <div>Loading...</div>;

    return (
      <h1 className="title">{info.label}</h1>
    );
  }
}

export default enhance(LocationView);
