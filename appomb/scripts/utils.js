module.exports = {
    isDebug: function (process) {
        return process.argv.indexOf('--prod') === -1;
    },
    execHandler: function (err, stdout, stderr) {
        console.log(stdout);
        if (stderr) {
            console.error(stderr);
        }
        if (err) {
            console.error(err);
            process.exit(1);
        }
    }
};
