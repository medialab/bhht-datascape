/**
 * BHHT Datascape People Module
 * =============================
 *
 * Redux module in charge of the people view.
 */
import client from '../client';
import {resolver} from './helpers';

/**
 * Constants.
 */
const PEOPLE_INFO_LOADING = 'People§InfoLoading';
const PEOPLE_INFO_LOADED = 'People§InfoLoaded';

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

  // When people info is loading
  [PEOPLE_INFO_LOADING](state) {
    return {
      ...state,
      info: null,
      infoLoading: true
    };
  },

  // When people info is loaded
  [PEOPLE_INFO_LOADED](state, action) {
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
export function loadPeopleInfo(name) {
  return dispatch => {

    dispatch({type: PEOPLE_INFO_LOADING});

    client.people.get({params: {name}}, (err, response) => {
      if (err)
        return;

      return dispatch({type: PEOPLE_INFO_LOADED, data: response.result});
    });
  };
}
