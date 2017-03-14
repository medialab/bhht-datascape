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

/**
 * Describing the application.
 */
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use(bodyParser.json({limit: '5mb'}));
app.use(compress());

/**
 * Mounting routers.
 */
app.get('/hello', (req, res) => res.json({hello: 'world'}));

/**
 * Exporting the application.
 */
module.exports = app;
