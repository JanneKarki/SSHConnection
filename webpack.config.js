const path = require('path');

module.exports = {
  // ...
  resolve: {
    fallback: {
      fs: false, // No need for the 'fs' module in the frontend
      child_process: false, // No need for the 'child_process' module in the frontend
      util: require.resolve('util/'), // Provide a fallback for the 'util' module
      stream: require.resolve('stream-browserify'), // Provide a fallback for the 'stream' module
      path: require.resolve('path-browserify'), // Provide a fallback for the 'path' module
      os: require.resolve('os-browserify/browser'), // Provide a fallback for the 'os' module
    },
  },
};