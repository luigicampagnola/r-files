const docusign = require("docusign-esign");
const restApi = docusign.ApiClient.RestApi;

const basePath = restApi.BasePath.PRODUCTION;

const user = {
  accoundId: "2871f932-4f10-45c8-92b5-c289c1f2ed49",
  integrationKey: "31fa0b99-010c-48ac-acbb-878620587013",
  secretKey: "1f71c902-9bce-47ee-8657-e76509f1a12a",
  basePath: basePath,
};

module.exports = user;
