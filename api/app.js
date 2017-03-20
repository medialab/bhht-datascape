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

const dolman = wrap(app, {typology});

/**
 * Mounting routers.
 */
const macroController = require('./controllers/macro');

app.use('/macro', dolman.router(macroController));

/**
 * Exporting the application.
 */
module.exports = app;
