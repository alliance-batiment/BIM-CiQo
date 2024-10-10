const { dependencies } = require('./package.json');
const axios = require('axios');

const {
  REACT_APP_LOGO,
  REACT_APP_API_URL
} = process.env;

module.exports = {
  name: 'remote',
  remotes: {
    "ID5899e0aca600741755433911": 'ID5899e0aca600741755433911@https://ids-editor.netlify.app/remoteEntry.js',
    // "connecteurOpenDthx": 'connecteurOpenDthx@http://localhost:3004/remoteEntry.js',
    "ID5899e0aca600741755433912": 'ID5899e0aca600741755433912@http://localhost:3001/remoteEntry.js'
    // "ID5899e0aca600741755433912": 'ID5899e0aca600741755433912@https://history.tridyme.com/remoteEntry.js'
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
    'react-redux': {
      singleton: true,
      requiredVersion: dependencies['react-redux'],
    },
    '@reduxjs/toolkit': {
      singleton: true,
      requiredVersion: dependencies['@reduxjs/toolkit'],
    },
  },
};