const msal = require('@azure/msal-node');

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL Node configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md
 */
const msalConfig = {
  auth: {
    clientId: '19b9c004-a5de-4508-b316-a86b0612eaa5',
    authority:
      'https://login.microsoftonline.com/0b53d2c1-bc55-4ab3-a161-927d289257f2/',
  },
};

const cca = new msal.ConfidentialClientApplication(msalConfig);

console.log(cca);

async function getToken() {
  return await cca
    .acquireTokenSilent({
      scopes: ['user.read'],
      account: {
        homeAccountId: '',
        environment: '',
        tenantId: '',
        username: '',
      },
    })
    .catch((error) => {
      console.log('Get token failed', JSON.stringify(error));
    });
}

module.exports = {
  getToken: getToken,
};
