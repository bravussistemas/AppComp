var fs = require('fs')
var path = require('path');

var ionicScriptsPath = path.join(__dirname, '..', 'node_modules/@ionic/app-scripts/dist/watch.js');


fs.readFile(ionicScriptsPath, 'utf8', function (err, data) {
    if (err) {
        throw err;
    }
    if(data.indexOf('//fixed_template_reload') !== -1){
        console.log("Already fixed!");
        return;
    }
    console.log("Fixing ionic-scripts templates not reload...");
    var template = 'just doing a template update is fine\n//fixed_template_reload\n' +
      'context.transpileState = interfaces_1.BuildState.RequiresUpdate;\n' +
      'context.deepLinkState = interfaces_1.BuildState.RequiresUpdate;\n';

    var result = data.replace(/just doing a template update is fine/g, template);
    fs.writeFile(ionicScriptsPath, result, 'utf8', function (err) {
        if (err) {
            throw err;
        }
    });
});

