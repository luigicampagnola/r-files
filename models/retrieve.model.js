const docusign = require("docusign-esign");
let count = 0;
const logger = require("../logger")

// R E T R I E V E  M O D E L

async function retrieveModel(
  accessToken,
  basePath,
  accountId,
  documentId,
  envelopeId
) {
  let dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(basePath);
  dsApiClient.addDefaultHeader("Authorization", "Bearer " + accessToken);

  let envelopesApi = new docusign.EnvelopesApi(dsApiClient),
    results = null;

  //console.log("retrieveModel", count++)

  //console.log(count++);
  try {
    return (results = await envelopesApi.getDocument(
      accountId,
      envelopeId,
      "combined", //combined or archived
      {}
    ));
  } catch (e) {
    logger.error(new Error(`error on results retrieveModel on ${envelopeId}`))
  }
}

module.exports = {
  retrieveModel,
};
