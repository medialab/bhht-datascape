/**
 * BHHT Datascape Express App
 * ===========================
 *
 * Describing the Express app serving the API.
 */
const express = require('express'),
      wrap = require('dolman'),
      bodyParser = require('body-parser'),
      compress = require('compression'),
      morgan = require('morgan'),
      cors = require('cors');

const typology = require('./typology');

/**
 * Describing the application.
 */
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use(bodyParser.json({limit: '5mb'}));
app.use(compress());
app.use(morgan('dev'));

const dolman = wrap(app, {typology});

/**
 * Mounting routers.
 */
const macroController = require('./controllers/macro'),
      peopleController = require('./controllers/people'),
      locationController = require('./controllers/location');

app.use('/macro', dolman.router(macroController));
app.use('/people', dolman.router(peopleController));
app.use('/location', dolman.router(locationController));

/**
 * Exporting the application.
 */
module.exports = app;
