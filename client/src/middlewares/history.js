/**
 * BHHT Datascape History Middleware
 * ==================================
 *
 * Redux middleware catching URL changes.
 */
import Mapper from 'url-mapper';
import router from '../router';
import {
  ROUTER_INIT,
  changeView
} from '../modules/router';

const mapper = new Mapper();

export default function historyMiddleware(history) {
  return store => {

    // Listening to the history
    const historyListener = location => {
      const route = mapper.map(location.pathname, router);

      if (route)
        store.dispatch(changeView(route.match, route.values));
      else
        history.push('/');
    };

    history.listen(historyListener);

    return next => action => {
      if (action.type === ROUTER_INIT)
        historyListener(history.location, 'INIT');

      return next(action);
    };
  };
}
