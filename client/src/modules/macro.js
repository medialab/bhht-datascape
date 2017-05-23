/**
 * BHHT Datascape Macro Module
 * ============================
 *
 * Redux module in charge of the macro view.
 */
import META from 'specs/meta.json';
import {createSelector} from 'reselect';
import client from '../client';
import {resolver} from './helpers';
import palettes from '../palettes';

/**
 * Constants.
 */
const MACRO_HISTOGRAM_LOADED = 'Macro§HistogramLoaded';
const MACRO_HISTOGRAM_LOADING = 'Macro§HistogramLoading';
const MACRO_SELECT_VALUE = 'Macro§SelectValue';
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
  values: [],
  histogram: null,
  topPeople: null,
  topLocations: null,
  loadingHistogram: false,
  loadingTopPeople: false,
  loadingTopLocations: false,
  period: ['' + META.dates.min, '' + META.dates.max]
};

/**
 * Selectors.
 */
const histogramSelector = state => state.macro.histogram,
      valuesSelector = state => state.macro.values;

export const histogramDataSelector = createSelector(
  histogramSelector,
  valuesSelector,
  (data, values) => {
    if (!data)
      return null;

    const selectedValues = new Map();

    values.forEach(value => (value.selected && selectedValues.set(value.name, value)));

    data = data.filter(line => selectedValues.has(line.name));

    const firstHistogram = data[0].histogram;

    const lines = new Array(firstHistogram.length),
          names = data.map(line => line.name),
          colors = data.map(line => selectedValues.get(line.name).color);

    for (let i = 0, l = lines.length; i < l; i++) {
      for (let j = 0, m = data.length; j < m; j++) {
        lines[i] = lines[i] || {from: firstHistogram[i].from, to: firstHistogram[i].to, sum: 0};
        lines[i][data[j].name] = data[j].histogram[i].count;
        lines[i].sum += data[j].histogram[i].count;
      }
    }

    return {values: lines, names, colors};
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
    const palette = palettes[state.mode];

    return {
      ...state,
      loadingHistogram: false,
      histogram: action.data,
      values: action.data
        .map((line, i) => ({name: line.name, selected: true, color: palette[i]}))
    };
  },

  // When selecting a value
  [MACRO_SELECT_VALUE](state, action) {

    // If payload value is `null` or if only one value is selected
    if (
      action.value === null ||
      (
        state.values.filter(value => value.selected).length === 1 &&
        state.values.find(value => value.name === action.value).selected
      )
    )
      return {
        ...state,
        values: state.values.map(value => {
          return {
            ...value,
            selected: true
          };
        })
      };

    // If every value is selected, we switch to a single value
    if (state.values.every(value => value.selected)) {
      return {
        ...state,
        values: state.values.map(value => {
          return {
            ...value,
            selected: value.name === action.value ? true : false
          };
        })
      };
    }

    // Else we just toggle this value
    return {
      ...state,
      values: state.values.map(value => {
        return {
          ...value,
          selected: value.name === action.value ? !value.selected : value.selected
        };
      })
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
      mode: action.mode,
      values: []
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

export function loadTopPeople(mode, period, values) {
  return dispatch => {
    dispatch({type: MACRO_TOP_PEOPLE_LOADING});

    const data = {mode, period};

    if (mode !== 'global' && values && values.length) {
      data.values = values
        .filter(value => value.selected)
        .map(value => value.name);

      if (data.values.length === values.length)
        delete data.values;
    }

    client.macro.topPeople({data}, (err, response) => {
      if (err)
        return;

      dispatch({type: MACRO_TOP_PEOPLE_LOADED, data: response.result});
    });
  };
}

export function loadTopLocations(mode, period, values) {
  return dispatch => {
    dispatch({type: MACRO_TOP_LOCATIONS_LOADING});

    const data = {mode, period};

    if (mode !== 'global' && values && values.length) {
      data.values = values
        .filter(value => value.selected)
        .map(value => value.name);

      if (data.values.length === values.length)
        delete data.values;
    }

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

export function selectValue(value) {
  return {type: MACRO_SELECT_VALUE, value};
}

export function updatePeriod(period) {
  return {type: MACRO_UPDATE_PERIOD, period};
}
