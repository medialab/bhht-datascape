/**
 * BHHT Datascape Macro View Component
 * ====================================
 *
 * Component rendering the macro view.
 */
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {loadHistogram} from '../../../modules/macro';

const enhance = C => {
  return connect(
    state => {
      return {};
    },
    dispatch => {
      return {
        actions: bindActionCreators({
          loadHistogram
        }, dispatch)
      };
    }
  )(C);
};

class MacroView extends Component {
  componentWillMount() {
    this.props.actions.loadHistogram();
  }

  render() {
    return (
      <div>MacroView</div>
    );
  }
}

export default enhance(MacroView);
