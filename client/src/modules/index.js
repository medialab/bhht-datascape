/**
 * BHHT Module Endpoint
 * =====================
 *
 * Endpoint combining all the modules' reducers for the store to consume.
 */
import {combineReducers} from 'redux';
import macro from './macro';
import router from './router';

const combined = combineReducers({
  macro,
  router
});

export default combined;
