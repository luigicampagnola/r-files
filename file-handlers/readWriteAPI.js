const { getFolderModel } = require("../models/folder.model");

const fs = require("fs"),
  JSONStream = require("JSONStream"),
  es = require("event-stream");
const events = require("events");
const path = require("path");
const { getUserInfoModel } = require("../models/userInfo.model");
const logger = require("../logger");

const eventEmitter = new events.EventEmitter();

const folderPath = path.dirname(__dirname) + "/data/";

const envelopeFile = path.join(folderPath, "envelopes.json");

const accountInfoFile = path.join(folderPath, "accountInfo.json");

const accessTokenInfoFile = path.join(folderPath, "access-token.json");

const accessAccountInfoFile = path.join(folderPath, "user-Info.json");

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


// WRITE ACCOUNT INFO (N O T  N E E D E D)

/* async function writeAccountInfo() {
  const results = await getUserInfoModel().catch((err) =>
    console.log("err on getUserInfo writeAccountInfo")
  );

  console.log(results);

  if (results) {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  }

  let writer = fs.createWriteStream(folderPath + "accountInfo.json");
  writer.write(JSON.stringify(results, null, 2));

  return "Success";
} */

// <-------------------------- R E A D  I N F O  J S O N  F I L E S --------------------------------->



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

eventEmitter.on("write", writeEnvelopesInfo);

eventEmitter.emit("write")
//eventEmitter.on("readAccountInfo", readEnvelopesInfo);

module.exports = {
  writeEnvelopesInfo,
  readEnvelopesInfo,
  readAccessToken,
  readAccountInformation,
};
