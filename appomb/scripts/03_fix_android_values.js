var fs = require('fs')
var path = require('path');
var packageJSON = require('../package.json');

var stringsPath = path.join(__dirname, '..', 'platforms/android/app/src/main/res/values/strings.xml');
var gradlePath = path.join(__dirname, '..', 'platforms/android/build.gradle');


// fs.readFile(stringsPath, 'utf8', function (err, data) {
//     if (err) {
//         throw err;
//     }
//     if(data.indexOf('fb_app_id') !== -1){
//         console.log("Already has face data!");
//         return;
//     }
//     console.log("Adding face data...");
//     var result = data.replace(/<\/resources>/g, '<string name="fb_app_id">'+faceInfo['APP_ID']+'</string><string name="fb_app_name">'+faceInfo['APP_NAME']+'</string></resources>');
//     fs.writeFile(stringsPath, result, 'utf8', function (err) {
//         if (err) {
//             throw err;
//         }
//     });
// });


fs.readFile(gradlePath, 'utf8', function (err, data) {
    if (err) {
        throw err;
    }
    if(data.indexOf('google()') !== -1){
        console.log("Already is Gadle fixed!");
        return;
    }
    console.log("Fixing Gadle config...");
    var result = data.replace(/jcenter\(\)/g, 'google()\njcenter()');
    fs.writeFile(gradlePath, result, 'utf8', function (err) {
        if (err) {
            throw err;
        }
    });
});

