var fs = require('fs');
var file = require('./config.example.json');

function GetEnvironmentVar(varname, defaultvalue)
{
    var result = process.env[varname];
    if (result)
        return result;
    else
        return defaultvalue;
}

file.api.port = GetEnvironmentVar("API_PORT", 4000);
file.elasticsearch.host = GetEnvironmentVar("ES_HOST", "index");
file.elasticsearch.port = GetEnvironmentVar("ES_PORT", 9200);
file.elasticsearch.user = GetEnvironmentVar("ES_USER", "user");
file.elasticsearch.user = GetEnvironmentVar("ES_PASSWORD", "password");

fs.writeFileSync('./config.json', JSON.stringify(file, null, 2));

var childProcess = require("child_process");
childProcess.fork("./scripts/api.js");
