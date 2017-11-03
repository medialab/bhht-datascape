/**
 * BHHT Datascape API Client
 * ==========================
 *
 * Djax client to query the API.
 */
import Client from 'djax-client';

const client = new Client({
  settings: {
    baseUrl: API_ENDPOINT
  },
  services: {
    macro: {
      histogram: '/macro/histogram',
      topPeople: '/macro/top-people',
      topLocations: '/macro/top-locations'
    },
    people: {
      get: '/people/:name',
      suggestions: '/people/suggestions'
    },
    location: {
      get: '/location/:name',
      suggestions: '/location/suggestions'
    },
    misc: {
      distinctInstanceValues: '/misc/distinct-instance-values'
    }
  }
});

export default client;
