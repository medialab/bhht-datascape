/**
 * BHHT Datascape API Client
 * ==========================
 *
 * Djax client to query the API.
 */
import Client from 'djax-client';
import CONFIG from '../config.json';

const client = new Client({
  settings: {
    baseUrl: CONFIG.api.endpoint
  },
  services: {
    macro: {
      histogram: '/macro/histogram',
      topPeople: '/macro/top-people',
      topLocations: '/macro/top-locations'
    },
    people: {
      get: '/people/:name'
    },
    location: {
      get: 'location/:name'
    }
  }
});

export default client;
