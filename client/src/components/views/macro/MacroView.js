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

import MacroViewLineChart from './MacroViewLineChart';

const enhance = C => {
  return connect(
    state => {
      return state.macro;
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
    const {
      histogram
    } = this.props;

    return (
      <div>
        {histogram && <MacroViewLineChart data={histogram} />}
      </div>
    );
  }
}

export default enhance(MacroView);
