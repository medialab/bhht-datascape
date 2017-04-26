const fs = require('fs'),
      config = require('./config.example.json');

function getEnv(coerce, name, defaultValue) {
  const result = process.env[name];

  return result ? coerce(result) : defaultvalue;
}

config.api.port = config(Number, 'API_PORT', 4000);
config.elasticsearch.host = config(String, 'ES_HOST', 'index');
config.elasticsearch.port = config(Number, 'ES_PORT', 9200);
config.elasticsearch.user = config(String, 'ES_USER', 'user');
config.elasticsearch.user = config(String, 'ES_PASSWORD', 'password');

fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

require('./scripts/api.js');
