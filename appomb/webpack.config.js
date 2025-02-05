const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    }),
  ],
  resolve: {
    fallback: {
      /*path: require.resolve('path-browserify'),
      './src/build': false, // Ignora o diretório `src/build`
      fs: false, // No polyfill; disable the module if you don’t need it
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto'),
      os: require.resolve('os-browserify/browser'), // Polyfill para `os`
      assert: require.resolve('assert'),
      util: require.resolve('util'),
      events: require.resolve('events'),
      vm: require.resolve('vm-browserify'), // Substitui 'vm' pelo polyfill para navegador
      process: require.resolve('process/browser'), // Polyfill para `process`*/

      path: false,
      //'./src/build': false, // Ignora o diretório `src/build`
      fs: false, // No polyfill; disable the module if you don’t need it
      stream: false,
      crypto: require.resolve("crypto"),
      os: false,
      assert: require.resolve('assert'),
      util: false,
      events: false,
      vm: false,
      "dtrace-provider": false,
    },
  },
};
