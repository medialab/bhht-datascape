/**
 * BHHT Datascape Macro Module
 * ============================
 *
 * Redux module in charge of the macro view.
 */
import {createSelector} from 'reselect';
import client from '../client';
import {resolver} from './helpers';

/**
 * Constants.
 */
const MACRO_HISTOGRAM_LOADED = 'Macro§HistogramLoaded';
const MACRO_HISTOGRAM_LOADING = 'Macro§HistogramLoading';
const MACRO_CHANGE_MODE = 'Macro§ChangeMode';

/**
 * Default state.
 */
const DEFAULT_STATE = {
  histogram: null,
  mode: 'global',
  loading: false
};

/**
 * Selectors.
 */
const histogramSelector = state => state.macro.histogram;

export const histogramDataSelector = createSelector(
  histogramSelector,
  data => {
    if (!data)
      return null;

    const firstHistogram = data[0].histogram;

    const values = new Array(firstHistogram.length),
          names = data.map(line => line.name);

    for (let i = 0, l = values.length; i < l; i++) {
      for (let j = 0, m = data.length; j < m; j++) {
        values[i] = values[i] || {from: firstHistogram[i].from};
        values[i][data[j].name] = data[j].histogram[i].count;
      }
    }

    return {values, names};
  }
);

/**
 * Reducer.
 */
export default resolver(DEFAULT_STATE, {

  // When histograms are loading
  [MACRO_HISTOGRAM_LOADING](state) {
    return {
      ...state,
      histogram: null,
      loading: true
    };
  },

  // When histogram data is received
  [MACRO_HISTOGRAM_LOADED](state, action) {
    return {
      ...state,
      loading: false,
      histogram: action.data
    };
  },

  // When mode is changes
  [MACRO_CHANGE_MODE](state, action) {
    return {
      ...state,
      mode: action.mode
    };
  }
});

/**
 * Actions.
 */
export function loadHistogram(mode) {
  return dispatch => {
    dispatch({type: MACRO_HISTOGRAM_LOADING});

    client.macro.histogram({data: {mode}}, (err, response) => {
      if (err)
        return;

      dispatch({type: MACRO_HISTOGRAM_LOADED, data: response.result});
    });
  };
}

export function changeMode(mode) {
  return dispatch => {
    dispatch({type: MACRO_CHANGE_MODE, mode});

    return dispatch(loadHistogram(mode));
  };
}
