/**
 * BHHT Module Endpoint
 * =====================
 *
 * Endpoint combining all the modules' reducers for the store to consume.
 */
import {combineReducers} from 'redux';

import location from './location';
import macro from './macro';
import people from './people';
import meta from './meta';
import router from './router';

const combined = combineReducers({
  location,
  macro,
  people,
  meta,
  router
});

export default combined;
