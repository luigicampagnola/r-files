const user = require("../data/data");
const { retrieveModel } = require("../models/retrieve.model");

const { createFolderDownload } = require("../src/folderFile");

const { Readable } = require("stream");
const fs = require("fs");
const events = require("events");
const path = require("path");
const {
  readEnvelopesInfo,
  readAccountInformation,
  readAccessToken,
} = require("../file-handlers/readWriteAPI");
const logger = require("../logger");

const eventEmitter = new events.EventEmitter();

// <-----------------------------------------------------------> //

// R E T R I E V E  C O N T R O L L E R

async function retrieveController(envelope, i) {
  const accountInfo = await readAccountInformation().catch((error) => {
    console.log("error on accountInfo retrieveController");
  });

  const accountId = accountInfo.accounts[0].accountId;
  const basePath = accountInfo.accounts[0].baseUri + "/restapi";

  const getAccessToken = await readAccessToken().catch((err) => {
    console.log("error getting accessToken retrieveController");
  });

  let accessToken = getAccessToken.accessToken;

  const args = {
    accessToken: accessToken,
    basePath: basePath,
    accountId: accountId,
    documentId: "combined",
    envelopeId: envelope,
  };

  const downloadResults = await retrieveModel(
    args.accessToken,
    args.basePath,
    args.accountId,
    args.documentId,
    args.envelopeId
  ).catch((error) => {
    console.log("failed to downloadResults retrieveController");
  });

  if (downloadResults) {
    await createFolderDownload();
  } else {
    console.log("error on createfolder retrieveController");
  }
  return downloadResults;
}

// <-----------------------------------------------------------> //

// R E S U L T S  H A N D L E R

async function resultsHandler() {
  const envelopesInfo = await readEnvelopesInfo().catch((err) => {
    console.log("error on envelopesInfo resultsHandler");
  });

  const accountInfo = await readAccountInformation().catch((erro) => {
    console.log("error on accountInfo resultsHandler");
  });

  const envelopes = envelopesInfo.envelopes;

  const envelopeDate = envelopes.map((envelope) => {
    return envelope.createdDateTime;
  });

  const formatDateTime = envelopeDate.map((date) => {
    let formatedDate = date.slice(0, -9);
    return formatedDate.replace(/:/g, "-");
  });

  const envelopeIds = envelopes.map((envelope) => {
    return envelope.envelopeId;
  });

  const emailSubjects = envelopes.map((envelope) => {
    let formatedSubject = envelope.emailSubject;
    return formatedSubject.replace(/ /g, "_");
  });

  const accountName = accountInfo.name;

  let formatedName = accountName.replace(/ /g, "_");

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const dataResult = await Promise.all(
    envelopeIds.map(async (envelope, i) => {
      await wait(i * 4200); //4200
      let data = await retrieveController(envelope, i).catch((err) => {
        logger.error("error getting results in resultHandler let data");
      });

      let buff = Buffer.from(data, "binary");

      let readable = new Readable();
      readable._read = () => {};
      readable.push(buff, "binary");
      readable.push(null);

      let folderPath = path.join(
        path.dirname(__dirname),
        "downloads",
        `${formatedName}`,
        `${emailSubjects[i]}-${formatDateTime[i]}.pdf`
      );

      let writable = fs.createWriteStream(folderPath);

      logger.info(`Downloading files of ${formatedName} ${[i]}`);

      readable.pipe(writable);
    })
  );
  logger.info("Process Ended");
  return dataResult;
}

eventEmitter.on("results", resultsHandler);
eventEmitter.emit("results", logger.info("Start Downloading Files"));

module.exports = {
  retrieveController,
};
