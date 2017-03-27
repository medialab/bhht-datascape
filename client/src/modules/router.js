/**
 * BHHT Datascape Router Module
 * =============================
 *
 * Redux module in charge of routing the URL.
 */
import {resolver} from './helpers';

/**
 * Constants.
 */
export const ROUTER_INIT = 'Router§Init';
const ROUTER_CHANGE_VIEW = 'Router§ChangeView';

/**
 * Default state.
 */
const DEFAULT_STATE = {
  view: 'macro',
  params: {}
};

/**
 * Reducer.
 */
export default resolver(DEFAULT_STATE, {
  [ROUTER_CHANGE_VIEW](state, action) {
    return {
      ...state,
      view: action.view,
      params: action.params
    };
  }
});

/**
 * Actions.
 */
export function initRouter() {
  return {type: ROUTER_INIT};
}

export function changeView(view, params) {
  return {type: ROUTER_CHANGE_VIEW, view, params};
}
