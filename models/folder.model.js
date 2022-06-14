const docusign = require("docusign-esign");
const user = require("../data/data");
const moment = require("moment");
const logger = require("../logger");

// G E T  F O L D E R  M O D E L

async function getFolderModel(accountId, token, basePath) {
  let dsApiClient = new docusign.ApiClient();

  dsApiClient.setBasePath(basePath);

  dsApiClient.addDefaultHeader("Authorization", "Bearer " + token);

  //console.log(user.accessToken)
  let envelopesApi = new docusign.EnvelopesApi(dsApiClient),
    results = null;

    //18331 hours
  let options = { fromDate: moment().subtract(5, "years").format() };

  try {
    return (results = await envelopesApi
      .listStatusChanges(accountId, options)
      .catch((err) => console.log(err)));
  } catch (e) {
    logger.error("error at results in getFolderMode");
  }

  //logger.error(results);
}

// G E T  R E C I P I E N T S  I N F O  M O D E L

async function getRecipientsInfoModel(accountId, envelopeId) {
  let dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(user.basePath);
  dsApiClient.addDefaultHeader("Authorization", "Bearer " + user.accessToken);

  let envelopesApi = new docusign.EnvelopesApi(dsApiClient);

  try {
    return (results = await envelopesApi.listRecipients(
      accountId,
      envelopeId,
      null
    ));
  } catch (e) {
    logger.error("error at results in getRecipientsInfoModel");
  }
}

module.exports = {
  getFolderModel,
  getRecipientsInfoModel,
};
