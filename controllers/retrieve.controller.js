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
    logger.error("failed to downloadResults retrieveController");
  });

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

  const envelopeSenderName = envelopes.map((envelopes) => {
    return envelopes.sender.userName.replace(/ /g, "_");
  });

  //console.log(envelopeSenderName);

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
    let emailSubject = envelope.emailSubject.replace(/\//g,"_");
    return emailSubject.split("/").join("_");
  });

  const envelopeStatus = envelopes.map((envelope) => {
    return envelope.status;
  });




  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const dataResult = await Promise.all(
    envelopeIds.map(async (envelope, i) => {
      await wait(i * 3700); //4200
      try {
        let data = await retrieveController(envelope, i).catch((err) => {
          logger.error("error getting results in resultHandler let data");
        });

        let buff = Buffer.from(data, "binary");

        let readable = new Readable();
        readable._read = () => {};
        readable.push(buff, "binary");
        readable.push(null);

        if (data) {
          await createFolderDownload(envelopeSenderName[i], envelopeStatus[i]);
        } else {
          logger.error("error on createfolder retrieveController");
        }

        if (envelopeStatus[i] === "void") {
          let folderPathVoid = path.join(
            path.dirname(__dirname),
            "downloads",
            `${envelopeSenderName[i] + "_" + envelopeStatus[i]}`,
            `${emailSubjects[i]}-${formatDateTime[i]}-${envelope}.pdf`
          );
          let writable = fs.createWriteStream(folderPathVoid);

          logger.info(
            `Downloading files of ${envelopeSenderName[i]}-${envelope}`
          );

          readable.pipe(writable);
        }
        let folderPath = path.join(
          path.dirname(__dirname),
          "downloads",
          `${envelopeSenderName[i]}`,
          `${emailSubjects[i]}-${formatDateTime[i]}-${envelope}.pdf`
        );

        let writable = fs.createWriteStream(folderPath);

        logger.info(
          `Downloading files of ${envelopeSenderName[i]} envelopeId:-${envelope} `
        );

        readable.pipe(writable);
      } catch (e) {
        logger.error("error getting results in resultHandler let data")
        return null;
      }
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
