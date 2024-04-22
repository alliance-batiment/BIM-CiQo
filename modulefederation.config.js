const { dependencies } = require('./package.json');
const axios = require('axios');

const {
  REACT_APP_LOGO,
  REACT_APP_API_URL
} = process.env;

module.exports = {
  name: 'remote',
  remotes: {
    "ID5899e0aca600741755433911": 'ID5899e0aca600741755433911@https://bim-ids.netlify.app/remoteEntry.js',
    // "connecteurOpenDthx": 'connecteurOpenDthx@https://connecteur.opendthx.org/remoteEntry.js'
  },
  shared: {
    ...dependencies,
    react: {
      singleton: true,
      requiredVersion: dependencies['react'],
    },
    'react-dom': {
      singleton: true,
      requiredVersion: dependencies['react-dom'],
    },
    'react-router-dom': {
      singleton: true,
      requiredVersion: dependencies["react-router-dom"],
    },
  },
};