// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  stream: require.resolve('stream-browserify'),
  buffer: require.resolve('buffer/'),
  process: require.resolve('process/browser'),
  util: require.resolve('util/'),
  events: require.resolve('events/'),
};

module.exports = config;
