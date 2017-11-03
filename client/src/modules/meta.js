/**
 * BHHT Datascape Meta Module
 * ===========================
 *
 * Redux module in charge of the meta views.
 */
import client from '../client';
import {resolver} from './helpers';

/**
 * Constants.
 */
const META_DISTINCT_INSTANCE_VALUES_LOADING = 'Meta§DistinctInstanceValuesLoading';
const META_DISTINCT_INSTANCE_VALUES_LOADED = 'Meta§DistinctInstanceValuesLoaded';

/**
 * Default state.
 */
const DEFAULT_STATE = {
  distinctInstanceValues: null,
  distinctInstanceValuesLoading: false
};

/**
 * Reducer.
 */
export default resolver(DEFAULT_STATE, {

  // When distinct instance values are loading
  [META_DISTINCT_INSTANCE_VALUES_LOADING](state) {
    return {
      ...state,
      distinctInstanceValues: null,
      distinctInstanceValuesLoading: true
    };
  },

  // When distinct instance values are loaded
  [META_DISTINCT_INSTANCE_VALUES_LOADED](state, action) {
    return {
      ...state,
      distinctInstanceValues: action.data,
      distinctInstanceValuesLoading: false
    };
  }
});

/**
 * Actions.
 */
export function loadDistinctInstanceValues() {
  return dispatch => {

    dispatch({type: META_DISTINCT_INSTANCE_VALUES_LOADING});

    client.meta.distinctInstanceValues((err, response) => {
      if (err)
        return;

      return dispatch({type: META_DISTINCT_INSTANCE_VALUES_LOADED, data: response.result});
    });
  };
}
