const docusign = require("docusign-esign");
const restApi = docusign.ApiClient.RestApi;

const basePath = restApi.BasePath.DEMO;

const user = {
  accoundId: "f1d272ba-909c-4ac4-a086-da5351e99ff7",
  integrationKey: "193474f6-8167-4895-9607-9a38d1c76769",
  secretKey: "c085f471-cb2e-4654-812c-7caced0ecd16",
  basePath: basePath,
};

module.exports = user;
