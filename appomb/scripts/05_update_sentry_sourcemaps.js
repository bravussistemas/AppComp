const {exec} = require('child_process');

var pack = require('../package.json');

const APP_VERSION = pack.version;

console.log(`Atualizando Sentry com código fonte da versão ${APP_VERSION} ...`);

function uploadSourceMap () {
  exec(`./node_modules/.bin/sentry-cli releases -o 'oh-my-bread' -p 'client-app'  files ${APP_VERSION} upload-sourcemaps --url-prefix / www/build --rewrite`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

function run() {
  exec(`./node_modules/.bin/sentry-cli releases -o 'oh-my-bread' -p 'client-app' new ${APP_VERSION}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    uploadSourceMap();
    console.log(`stdout: ${stdout}`);
  });
}

run();
