const docusign = require("docusign-esign");
const restApi = docusign.ApiClient.RestApi;

const basePath = restApi.BasePath.DEMO;

const user = {
  basePath: basePath,
  accountId: "d49abe6c-b9b4-4d91-a032-79c071964ca4",
  integrationKey: "15cd16b3-e021-400e-9290-f752b60d6350",
  secretKey: "3cbc7054-55f5-4aa3-940a-dcc501ce2fbb",
};

module.exports = user;
