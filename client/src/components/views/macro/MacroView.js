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
import {compose} from 'recompose';
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
    <div className="control">
      <span className="select">
        <select value={selected} onChange={onChange}>
          {MODES.map(mode => {
            return (
              <option key={mode.name} value={mode.name}>{mode.label}</option>
            );
          })}
        </select>
      </span>
    </div>
  );
}

/**
 * Connector.
 */
const enhance = compose(
  connect(
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
  )
);

/**
 * Main component.
 */
class MacroView extends Component {
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
        <h1 className="title">Macro View</h1>
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
        <div className="columns">
          <div className="column">
            <MacroViewTopList
              title="Top 100 people"
              entityName="people"
              data={topPeople} />
          </div>
          <div className="column">
            <MacroViewTopList
              title="Top 100 locations"
              entityName="location"
              data={topLocations} />
          </div>
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
      </div>
    );
  }
}

export default enhance(MacroView);
