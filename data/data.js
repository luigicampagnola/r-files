const docusign = require("docusign-esign");
const restApi = docusign.ApiClient.RestApi;

const basePath = restApi.BasePath.PRODUCTION;

const user = {
  basePath: basePath,
  accountId: "9a10f39b-1af3-4cc0-b0be-c9a5113b8f9e",
  integrationKey: "15cd16b3-e021-400e-9290-f752b60d6350",
  secretKey: "15c17d5d-2144-4203-a6e8-27c8497b3e58",
};

module.exports = user;
