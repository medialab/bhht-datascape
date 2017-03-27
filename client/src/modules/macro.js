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
const MACRO_TOP_PEOPLE_LOADED = 'Macro§TopPeopleLoaded';
const MACRO_TOP_PEOPLE_LOADING = 'Macro§TopPeopleLoading';
const MACRO_TOP_LOCATIONS_LOADED = 'Macro§TopLocationsLoaded';
const MACRO_TOP_LOCATIONS_LOADING = 'Macro§TopLocationsLoading';
const MACRO_CHANGE_MODE = 'Macro§ChangeMode';
const MACRO_UPDATE_PERIOD = 'Macro§UpdatePeriod';

/**
 * Default state.
 */
const DEFAULT_STATE = {
  mode: 'global',
  histogram: null,
  topPeople: null,
  topLocations: null,
  loadingHistogram: false,
  loadingTopPeople: false,
  loadingTopLocations: false,
  period: ['-2200', '2010']
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
      loadingHistogram: true
    };
  },

  // When histogram data is received
  [MACRO_HISTOGRAM_LOADED](state, action) {
    return {
      ...state,
      loadingHistogram: false,
      histogram: action.data
    };
  },

  // When top people are loading
  [MACRO_TOP_PEOPLE_LOADING](state) {
    return {
      ...state,
      topPeople: null,
      loadingTopPeople: true
    };
  },

  // When top people data is received
  [MACRO_TOP_PEOPLE_LOADED](state, action) {
    return {
      ...state,
      loadingTopPeople: false,
      topPeople: action.data
    };
  },

  // When top locations are loading
  [MACRO_TOP_LOCATIONS_LOADING](state) {
    return {
      ...state,
      topLocations: null,
      loadingTopLocations: true
    };
  },

  // When top locations data is received
  [MACRO_TOP_LOCATIONS_LOADED](state, action) {
    return {
      ...state,
      loadingTopLocations: false,
      topLocations: action.data
    };
  },

  // When mode is changes
  [MACRO_CHANGE_MODE](state, action) {
    return {
      ...state,
      mode: action.mode
    };
  },

  // When period is updated
  [MACRO_UPDATE_PERIOD](state, action) {
    return {
      ...state,
      period: action.period
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

export function loadTopPeople(period) {
  return dispatch => {
    dispatch({type: MACRO_TOP_PEOPLE_LOADING});

    const data = {period};

    client.macro.topPeople({data}, (err, response) => {
      if (err)
        return;

      dispatch({type: MACRO_TOP_PEOPLE_LOADED, data: response.result});
    });
  };
}

export function loadTopLocations(period) {
  return dispatch => {
    dispatch({type: MACRO_TOP_LOCATIONS_LOADING});

    const data = {period};

    client.macro.topLocations({data}, (err, response) => {
      if (err)
        return;

      dispatch({type: MACRO_TOP_LOCATIONS_LOADED, data: response.result});
    });
  };
}


export function changeMode(mode) {
  return dispatch => {
    dispatch({type: MACRO_CHANGE_MODE, mode});

    return dispatch(loadHistogram(mode));
  };
}

export function updatePeriod(period) {
  return {type: MACRO_UPDATE_PERIOD, period};
}
