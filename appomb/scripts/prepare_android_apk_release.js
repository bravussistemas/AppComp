const utils = require('./utils'),
  {version} = require('../package.json'),
  fs = require('fs'),
  path = require('path'),
  os = require('os'),
  exec = require('child_process').execSync;

const KEYSTORE_PATH = 'ohmybread.keystore';
const KEYSTORE_PASS = 'Ohmybread32#@';
const APK_PATH = 'platforms/android/app/build/outputs/bundle/release/';
const APK_UNSIGNED_PATH = APK_PATH + 'app-release.aab';
const APK_RELEASE_PATH = APK_PATH + 'app-release-signed.aab';
const APK_UNSIGNED_ALIGNED_PATH = APK_PATH + 'app-unsigned-aligned.aab';
const APP_VERSION = version;
const ANDROID_SDK_VERSION = '32.0.0';
const ANDROID_HOME = "/Users/bravussistemas/Library/Android/sdk";
const ANDROID_SDK_HOME = ANDROID_HOME + '/build-tools/' + ANDROID_SDK_VERSION + '/';

// COMMANDS
// /Users/bravussistemas/Library/Android/sdk/build-tools/32.0.0/zipalign -v 4 platforms/android/app/build/outputs/bundle/release/app-release.aab platforms/android/app/build/outputs/bundle/release/app-unsigned-aligned.aab
const ALIGN_APK_CMD = ANDROID_SDK_HOME + 'zipalign -v -p 4 ' + APK_UNSIGNED_PATH + ' ' + APK_UNSIGNED_ALIGNED_PATH;
// /Users/bravussistemas/Library/Android/sdk/build-tools/32.0.0/apksigner sign --min-sdk-version 30 --ks ohmybread.keystore --ks-pass pass:Ohmybread32#@ --out platforms/android/app/build/outputs/bundle/release/app-release-signed.aab platforms/android/app/build/outputs/bundle/release/app-unsigned-aligned.aab
const SIGN_APK_CMD = ANDROID_SDK_HOME + 'apksigner sign --min-sdk-version 30 --ks ' + 
      KEYSTORE_PATH + ' --ks-pass pass:' + KEYSTORE_PASS + ' --out ' + APK_RELEASE_PATH + ' ' + APK_UNSIGNED_ALIGNED_PATH;
// /Users/bravussistemas/Library/Android/sdk/build-tools/32.0.0/apksigner verify platforms/android/app/build/outputs/bundle/release/app-release-signed.aab
const VERIFY_APK_CMD = ANDROID_SDK_HOME + 'apksigner verify ' + APK_RELEASE_PATH;

// REMOVE OLD RELEASE APK
if (fs.existsSync(APK_RELEASE_PATH)) {
  console.log("Removing old release apk file: " + APK_RELEASE_PATH);
  fs.unlinkSync(APK_RELEASE_PATH);
}

// REMOVE OLD UNSIGNED APK
if (fs.existsSync(APK_UNSIGNED_ALIGNED_PATH)) {
  console.log("Removing old unsigned release apk file: " + APK_UNSIGNED_ALIGNED_PATH);
  fs.unlinkSync(APK_UNSIGNED_ALIGNED_PATH);
}

// EXECUTE THE BUILD
exec('ionic cordova build android --prod --release', {stdio: [0, 1, 2]});
exec(ALIGN_APK_CMD, {stdio: [0, 1, 2]});
exec(SIGN_APK_CMD, {stdio: [0, 1, 2]});
exec(VERIFY_APK_CMD, {stdio: [0, 1, 2]});
