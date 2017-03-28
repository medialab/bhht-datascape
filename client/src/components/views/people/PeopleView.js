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

export default enhance(PeopleView);
