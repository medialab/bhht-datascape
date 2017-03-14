/**
 * BHHT Datascape API Client
 * ==========================
 *
 * Djax client to query the API.
 */
import Client from 'djax-client';

const client = new Client({
  settings: {
    baseUrl: '//localhost:4000'
  },
  services: {
    topPeople: '/data/top-people'
  }
});

export default client;
