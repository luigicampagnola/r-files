const events = require("events");
const docusign = require("docusign-esign");
const data = require("../data/data");
const logger = require("../logger");

const eventEmitter = new events.EventEmitter();

async function getSharedEnvelopes() {
  let dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(data.basePath);
  dsApiClient.addDefaultHeader("Authorization", "Bearer " + data.accessToken);
  let folders = new docusign.FoldersApi(dsApiClient),
    results = null;

  let shared = new docusign.AccountsApi(dsApiClient);

  try {
    return (results = await shared.listSharedAccess(data.accountId));
  } catch (e) {
    logger.error("error retrieving files from getSharedEnvelopes");
  }

  //console.log(results);
}
//eventEmitter.on("getEnvelope", getSharedEnvelopes);
//eventEmitter.emit("getEnvelope")

module.exports = {
  getSharedEnvelopes,
};
