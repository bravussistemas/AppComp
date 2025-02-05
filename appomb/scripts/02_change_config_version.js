var fs = require('fs')
var path = require('path');
var packageJSON = require('../package.json');

var version = packageJSON.version;

var configPath = path.join(__dirname, '..', 'config.xml');

console.log('Changing config.xml version to: ' + version);

fs.readFile(configPath, 'utf8', function (err, data) {
    if (err) {
        throw err;
    }
    var result = data.replace(/version="(.*?)"/g, 'version="'+version+'"');
    fs.writeFile(configPath, result, 'utf8', function (err) {
        if (err) {
            throw err;
        }
    });
});

