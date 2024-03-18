const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

const webpackConfigPath = 'react-scripts/config/webpack.config';
const webpackConfig = require(webpackConfigPath);

const override = (config) => {
  config.plugins.push(new ModuleFederationPlugin(require('../../../modulefederation.config.js')));

  config.output = {
    path: path.join(__dirname, "../../../build"),
    publicPath: '/',
    filename: "bundle.js",
  };

  return config;
};

require.cache[require.resolve(webpackConfigPath)].exports = (env) => override(webpackConfig(env));

module.exports = require(webpackConfigPath);
