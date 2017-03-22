/**
 * BHHT Module Endpoint
 * =====================
 *
 * Endpoint combining all the modules' reducers for the store to consume.
 */
import {combineReducers} from 'redux';
import macro from './macro';

const combined = combineReducers({
  macro
});

export default combined;
