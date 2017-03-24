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
      return {
        mode: state.macro.mode
      };
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
  componentDidMount() {
    const {
      actions,
      mode
    } = this.props;

    actions.loadHistogram(mode);
  }

  render() {
    return (
      <div>MacroView</div>
    );
  }
}

export default enhance(MacroView);
