/**
 * BHHT Datascape Macro Module
 * ============================
 *
 * Redux module in charge of the macro view.
 */
import client from '../client';
import {resolver} from './helpers';

/**
 * Constants.
 */
const MACRO_HISTOGRAM_LOADED = 'Macro§HistogramLoaded';
const MACRO_HISTOGRAM_LOADING = 'Macro§HistogramLoading';

/**
 * Default state.
 */
const DEFAULT_STATE = {
  histogram: null,
  mode: 'categories',
  loading: false
};

/**
 * Reducer.
 */
export default resolver(DEFAULT_STATE, {

  // When histograms are loading
  [MACRO_HISTOGRAM_LOADING](state) {
    return {
      ...state,
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
