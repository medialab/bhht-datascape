/**
 * BHHT Datascape Macro View Component
 * ====================================
 *
 * Component rendering the macro view.
 */
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Measure from 'react-measure';
import MacroViewLineChart from './MacroViewLineChart';
import MacroViewTopList from './MacroViewTopList';
import {
  loadHistogram,
  loadTopPeople,
  changeMode,
  histogramDataSelector
} from '../../../modules/macro';

/**
 * Constants.
 */
const MODES = [
  {
    name: 'global',
    label: 'Global'
  },
  {
    name: 'gender',
    label: 'By gender'
  },
  {
    name: 'categories',
    label: 'By category'
  },
  {
    name: 'subcategories',
    label: 'By subcategory'
  },
  {
    name: 'languages',
    label: 'By language'
  }
];

/**
 * Mode selector.
 */
function MacroViewModeSelector({selected, onChange}) {
  return (
    <select value={selected} onChange={onChange}>
      {MODES.map(mode => {
        return (
          <option key={mode.name} value={mode.name}>{mode.label}</option>
        );
      })}
    </select>
  );
}

/**
 * Connector.
 */
const enhance = C => {
  return connect(
    state => {
      return {
        mode: state.macro.mode,
        histogramData: histogramDataSelector(state),
        topPeople: state.macro.topPeople
      };
    },
    dispatch => {
      return {
        actions: bindActionCreators({
          loadHistogram,
          loadTopPeople,
          changeMode
        }, dispatch)
      };
    }
  )(C);
};

/**
 * Main component.
 */
class MacroView extends Component {
  componentDidMount() {
    const {
      actions,
      mode
    } = this.props;

    actions.loadHistogram(mode);
    actions.loadTopPeople();
  }

  render() {
    const {
      actions,
      histogramData,
      topPeople,
      mode
    } = this.props;

    return (
      <div>
        {histogramData && (
          <Measure>
            {dimensions => (
              <div style={{width: '100%'}}>
                <MacroViewLineChart
                  dimensions={dimensions}
                  data={histogramData}
                  mode={mode} />
              </div>
            )}
          </Measure>
        )}
        <MacroViewModeSelector selected={mode} onChange={e => actions.changeMode(e.target.value)} />
        {topPeople && (
          <MacroViewTopList data={topPeople} />
        )}
      </div>
    );
  }
}

export default enhance(MacroView);
