const docusign = require("docusign-esign");
const user = require("../data/data");
const logger = require("../logger");

/* const events = require("events");

const eventEmitter = new events.EventEmitter(); */

async function getUserInfoModel(token) {
  let dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(user.basePath);
  dsApiClient.addDefaultHeader("Authorization", "Bearer " + token);

  const accountsApi = new docusign.AccountsApi(dsApiClient);
  const account = await accountsApi.getAccountInformation(user.accountId);

  try {
    return account;
  } catch (e) {
    logger.error("error at account on getUserInfoModel");
  }
}

//eventEmitter.on("getUser", getUserInfoModel);
//eventEmitter.emit("getUser");

module.exports = {
  getUserInfoModel,
};
