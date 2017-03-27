/**
 * BHHT Datascape Macro View Component
 * ====================================
 *
 * Component rendering the macro view.
 */
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import debounce from 'lodash/debounce';
import Measure from 'react-measure';
import MacroViewLineChart from './MacroViewLineChart';
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

    this.debouncedLoadTopPeople = debounce(() => {
      this.props.actions.loadTopPeople(this.props.period);
    }, 500);

    this.debouncedLoadTopLocations = debounce(() => {
      this.props.actions.loadTopLocations(this.props.period);
    }, 500);
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
        {histogramData && (
          <Measure>
            {dimensions => (
              <div style={{width: '100%'}}>
                <MacroViewLineChart
                  dimensions={dimensions}
                  data={histogramData}
                  mode={mode}
                  period={period}
                  onBrush={newPeriod => {
                    actions.updatePeriod(newPeriod);
                    this.debouncedLoadTopPeople(newPeriod);
                    this.debouncedLoadTopLocations(newPeriod);
                  }} />
              </div>
            )}
          </Measure>
        )}
        <MacroViewModeSelector selected={mode} onChange={e => actions.changeMode(e.target.value)} />
        <div className="columns">
          {topPeople && (
            <div className="column">
              <MacroViewTopList data={topPeople} />
            </div>
          )}
          {topLocations && (
            <div className="column">
              <MacroViewTopList data={topLocations} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default enhance(MacroView);
