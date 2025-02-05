#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var rootdir = __dirname;


var androidResDir = 'platforms/android/app/src/main/res/';
var xxxDir = androidResDir + 'drawable-xxxhdpi/';

if (!fs.existsSync(xxxDir)) {
    fs.mkdirSync(xxxDir);
}

var filestocopy = [{
    'resources/android/icon/drawable-hdpi-icon.png':
    androidResDir + 'drawable-hdpi/ic_stat_onesignal_default.png'
}, {
    'resources/android/icon/drawable-mdpi-icon.png':
    androidResDir + 'drawable-mdpi/ic_stat_onesignal_default.png'
}, {
    'resources/android/icon/drawable-xhdpi-icon.png':
    androidResDir + 'drawable-xhdpi/ic_stat_onesignal_default.png'
}, {
    'resources/android/icon/drawable-xxhdpi-icon.png':
    androidResDir + 'drawable-xxhdpi/ic_stat_onesignal_default.png'
}, {
    'resources/android/icon/drawable-xxxhdpi-icon.png':
    xxxDir + 'ic_stat_onesignal_default.png'
}];

filestocopy.forEach(function (obj) {
    Object.keys(obj).forEach(function (key) {
        var val = obj[key];
        var srcFile = path.join(rootdir, '..', key);
        var destFile = path.join(rootdir, '..', val);
        console.log('===============');
        console.log('copying ' + srcFile + ' to ' + destFile);
        var destDir = path.dirname(destFile);
        if (!fs.existsSync(destDir)) {
            throw new Error('Destination dir to copy OneSignal icons does not exists: ' + destDir);
        }
        if (!fs.existsSync(srcFile)) {
            throw new Error('Origin file to copy OneSignal icons does not exists: ' + srcFile);
        }
        fs.createReadStream(srcFile).pipe(fs.createWriteStream(destFile));
        console.log('SUCCESS!!');
        console.log('===============');
    });
});
