# BHHT Datascape

## architecture

- export code to extract data from Wikipedia is not in thie repository
- This application starts with importing the database from three CSV file:
  - people
  - trajectories
  - locations
 
 ### /scripts
 
 In this folder are the scripts to import the csv files into an ElasticSearch engine.
 
 ### ElasticSearch engine
 
The /specs folder defines the Elasticsearch engine configuration.
 
 ### /api
 
 This code serves a REST API (node + express) to provide data from ElasticSearch to the client.
 
 ### /client
 
 React + baobab/redux? javascript web application which provides interactive data visualisations.
