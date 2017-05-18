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
import debounce from 'debounce';
import cls from 'classnames';
import Measure from 'react-measure';
import MacroViewLineChart from './MacroViewLineChart';
import MacroViewSmallMultiples from './MacroViewSmallMultiples';
import MacroViewTopList from './MacroViewTopList';
import {
  loadHistogram,
  loadTopPeople,
  loadTopLocations,
  changeMode,
  selectValue,
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
  },
  {
    name: 'precision',
    label: 'By date precision'
  }
];

/**
 * Mode selector.
 */
function MacroViewModeSelector(props) {
  const {
    selected,
    values,
    onChange,
    onSelect
  } = props;

  return (
    <table>
      <tbody>
        <tr>
          <td className="control" style={{whitespace: 'no-wrap'}}>
            <span className="select">
              <select value={selected} onChange={onChange}>
                {MODES.map(mode => {
                  return (
                    <option key={mode.name} value={mode.name}>{mode.label}</option>
                  );
                })}
              </select>
            </span>
          </td>
          <td style={{textAlign: 'center', width: '99%'}}>
            {selected !== 'global' &&
              values.map(value => {
                const muted = !value.selected;

                return (
                  <a
                    key={value.name}
                    style={{backgroundColor: muted ? null : value.color}}
                    className={cls('button', 'value-selector', muted && 'muted')}
                    onClick={() => onSelect(value.name)}>
                    {value.name}
                  </a>
                );
              })
            }
          </td>
        </tr>
      </tbody>
    </table>
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
        values: state.macro.values,
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
          selectValue,
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
      period,
      values,
      histogramData,
      topPeople,
      topLocations
    } = this.props;

    if (!histogramData)
      actions.loadHistogram(mode);

    if (!topPeople)
      actions.loadTopPeople(mode, period, values);

    if (!topLocations)
      actions.loadTopLocations(mode, period, values);

    this.debouncedLoadTopPeople = debounce(() => {
      this.props.actions.loadTopPeople(
        this.props.mode,
        this.props.period,
        this.props.values
      );
    }, 500);
  }

  render() {
    const {
      actions,
      histogramData,
      topPeople,
      topLocations,
      mode,
      values,
      period
    } = this.props;

    const moreThanOneValue = values.filter(value => value.selected).length > 1;

    return (
      <div id="macro-view">
        <h1 className="title">A brief history of human time</h1>
        <MacroViewModeSelector
          selected={mode}
          values={values}
          onSelect={value => {
            actions.selectValue(value);
            this.debouncedLoadTopPeople();
          }}
          onChange={e => {
            actions.changeMode(e.target.value);
            this.debouncedLoadTopPeople();
          }} />
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
                      actions.loadTopPeople(mode, newPeriod, values);
                      actions.loadTopLocations(mode, newPeriod, values);
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
        {histogramData && moreThanOneValue && (
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
