/**
 * BHHT Datascape Location Module
 * ===============================
 *
 * Redux module in charge of the location view.
 */
import client from '../client';
import {resolver} from './helpers';

import {ROUTER_CHANGE_VIEW} from './router';

/**
 * Constants.
 */
const LOCATION_INFO_LOADING = 'Location§InfoLoading';
const LOCATION_INFO_LOADED = 'Location§InfoLoaded';

/**
 * Default state.
 */
const DEFAULT_STATE = {
  info: null,
  infoLoading: false
};

/**
 * Reducer.
 */
export default resolver(DEFAULT_STATE, {

  // When the route changes
  [ROUTER_CHANGE_VIEW](state) {
    return {
      ...state,
      info: null
    };
  },

  // When people info is loading
  [LOCATION_INFO_LOADING](state) {
    return {
      ...state,
      info: null,
      infoLoading: true
    };
  },

  // When people info is loaded
  [LOCATION_INFO_LOADED](state, action) {
    return {
      ...state,
      info: action.data,
      infoLoading: false
    };
  }
});

/**
 * Actions.
 */
export function loadLocationInfo(name) {
  return dispatch => {

    dispatch({type: LOCATION_INFO_LOADING});

    client.location.get({params: {name}}, (err, response) => {
      if (err)
        return;

      return dispatch({type: LOCATION_INFO_LOADED, data: response.result});
    });
  };
}
