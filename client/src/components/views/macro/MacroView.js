/* eslint react/jsx-no-bind: 0 */
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
import MacroViewSmallMultiples from './MacroViewSmallMultiples';
import MacroViewTopList from './MacroViewTopList';
import {
  loadHistogram,
  loadTopPeople,
  loadTopLocations,
  changeMode,
  updatePeriod,
  histogramDataSelector
} from '../../../modules/macro';

/**
 * Constants.
 */
const MODES = [
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
        topPeople: state.macro.topPeople,
        topLocations: state.macro.topLocations,
        period: state.macro.period
      };
    },
    dispatch => {
      return {
        actions: bindActionCreators({
          loadHistogram,
          loadTopPeople,
          loadTopLocations,
          changeMode,
          updatePeriod
        }, dispatch)
      };
    }
  )(C);
};

/**
 * Main component.
 */
class MacroView extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    const {
      actions,
      mode,
      period
    } = this.props;

    actions.loadHistogram(mode);
    actions.loadTopPeople(period);
    actions.loadTopLocations(period);
  }

  render() {
    const {
      actions,
      histogramData,
      topPeople,
      topLocations,
      mode,
      period
    } = this.props;

    return (
      <div>
        <MacroViewModeSelector selected={mode} onChange={e => actions.changeMode(e.target.value)} />
        <div style={{height: '250px'}}>
          {histogramData && (
            <Measure style={{height: '250px'}}>
              {dimensions => (
                <div style={{width: '100%'}}>
                  <MacroViewLineChart
                    dimensions={dimensions}
                    data={histogramData}
                    mode={mode}
                    period={period}
                    onBrush={newPeriod => {
                      actions.updatePeriod(newPeriod);
                      actions.loadTopPeople(newPeriod);
                      actions.loadTopLocations(newPeriod);
                    }} />
                </div>
              )}
            </Measure>
          )}
        </div>
        {histogramData && mode !== 'global' && (
          <Measure>
            {dimensions => (
              <div style={{width: '100%'}}>
                <MacroViewSmallMultiples
                  dimensions={dimensions}
                  data={histogramData}
                  mode={mode}
                  period={period} />
              </div>
            )}
          </Measure>
        )}
        <div className="columns">
          <div className="column">
            <MacroViewTopList title="Top 100 people" data={topPeople} />
          </div>
          <div className="column">
            <MacroViewTopList title="Top 100 locations" data={topLocations} />
          </div>
        </div>
      </div>
    );
  }
}

export default enhance(MacroView);
