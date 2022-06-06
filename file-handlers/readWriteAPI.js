const { getFolderModel } = require("../models/folder.model");

const fs = require("fs"),
  JSONStream = require("JSONStream"),
  es = require("event-stream");
const events = require("events");
const path = require("path");
const { getUserInfoModel } = require("../models/userInfo.model");
const logger = require("../logger");
const { getSharedEnvelopes } = require("../models/sharedEnvelopes");

const eventEmitter = new events.EventEmitter();

const folderPath = path.dirname(__dirname) + "/data/";

const envelopeFile = path.join(folderPath, "envelopes.json");

const accountInfoFile = path.join(folderPath, "accountInfo.json");

const accessTokenInfoFile = path.join(folderPath, "access-token.json");

const accessAccountInfoFile = path.join(folderPath, "user-Info.json");

const errorFile = path.join(folderPath, "errorEnvelopes.json");
//const errorFile = path.join(folderPath,)

const envelopeErrors = require("../used-data/errors(1).js");

// <-------------------------- W R I T E  I N F O  J S O N  F I L E S --------------------------------->

// WRITE FILE ENVELOPES

async function writeEnvelopesInfo() {
  const accountInfo = await readAccountInformation().catch((err) => {
    logger.error("error readAccountInformation writeEnvelopesInfo");
  });

  const accessToken = await readAccessToken().catch((err) => {
    logger.error("error getting accessToken  writeEnvelopesInfo");
  });

  let token = accessToken.accessToken;

  const accoundId = accountInfo.accounts[0].accountId;
  let basePath = accountInfo.accounts[0].baseUri + "/restapi";

  const results = await getFolderModel(accoundId, token, basePath).catch(
    (erro) => logger.error("error handling getFolderModel writeEnvelopesInfo")
  );

  if (results) {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  }

  let writer = fs.createWriteStream(folderPath + "envelopes.json");

  writer.write(JSON.stringify(results, null, 2));
}

async function writeErrorEnvelopesFile() {
  const envelopesInfo = await readEnvelopesInfo().catch((err) => {
    console.log("error on envelopesInfo resultsHandler");
  });

  const envelopes = envelopesInfo.envelopes;

  const filteredErrrors = envelopes.map((envelope, i) => {
    for (let i = 0; i < envelopes.length; i++) {
      if (envelope.envelopeId === envelopeErrors[i]) {
        return envelope;
      }
    }
  });

  if (filteredErrrors) {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  }

  let writer = fs.createWriteStream(folderPath + "errorEnvelopes.json");

  writer.write(JSON.stringify(filteredErrrors, null, 2));

  //console.log(envelopesInfo.envelopes)

  //console.log(envelopeErrors)
}

//eventEmitter.on("envelopeError", writeErrorEnvelopesFile);
//eventEmitter.emit("envelopeError"); 
// <-------------------------- R E A D  I N F O  J S O N  F I L E S --------------------------------->
async function readErrorEnvelopesInfo() {
  let reader = fs.createReadStream(errorFile, "utf8");
  let data = "";
  for await (const chunk of reader) {
    data += chunk;
  }

  return JSON.parse(data);
}

async function readEnvelopesInfo() {
  let reader = fs.createReadStream(envelopeFile, "utf8");
  let data = "";
  for await (const chunk of reader) {
    data += chunk;
  }

  return JSON.parse(data);
}

// R E A D  A C C E S S  T O K E N

async function readAccessToken() {
  let accessToken = fs.createReadStream(accessTokenInfoFile, "utf8");
  let data = "";

  for await (const chunk of accessToken) {
    data += chunk;
  }

  return JSON.parse(data);
}

// R E A D  A C C O U N T  I N F O R M A T I O N

async function readAccountInformation() {
  let accountInfo = fs.createReadStream(accessAccountInfoFile, "utf8");
  let data = "";

  for await (const chunk of accountInfo) {
    data += chunk;
  }

  return JSON.parse(data);
}

//eventEmitter.on("write", writeEnvelopesInfo);

//eventEmitter.emit("write");

module.exports = {
  writeEnvelopesInfo,
  readEnvelopesInfo,
  readAccessToken,
  readAccountInformation,
  readErrorEnvelopesInfo
};
