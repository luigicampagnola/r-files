const {
  readAccountInformation,
  readEnvelopesInfo,
} = require("../file-handlers/readWriteAPI");
const fs = require("fs");
const logger = require("../logger");

const path = require("path");

async function createFolderDownload(envelopeSenderName, envelopeStatus) {
  if (envelopeStatus === "void") {
    const folderDownload = path.dirname(__dirname) + "/downloads/";
    let senderName = envelopeSenderName;

    //console.log(__dirname)
    const accountNameFolder =
      folderDownload + senderName + "_" + envelopeStatus;

    //console.log(accountNameFolder);
    if (!fs.existsSync(folderDownload)) {
      fs.mkdirSync(folderDownload);
    }
    if (!fs.existsSync(accountNameFolder)) {
      fs.mkdirSync(accountNameFolder);
      logger.info("New Folder - Name: " + senderName);
    }
  }

  const accountInfo = await readAccountInformation().catch((err) =>
    console.log("error accountInfo createFolderDownload")
  );

  let senderName = envelopeSenderName;

  const accountName = accountInfo.name;
  let formatedName = accountName.replace(/ /g, "_");

  const folderDownload = path.dirname(__dirname) + "/downloads/";

  //console.log(__dirname)
  const accountNameFolder = folderDownload + senderName;

  //console.log(accountNameFolder);
  if (!fs.existsSync(folderDownload)) {
    fs.mkdirSync(folderDownload);
  }
  if (!fs.existsSync(accountNameFolder)) {
    fs.mkdirSync(accountNameFolder);
    logger.info("New Folder - Name: " + senderName);
  }
}

module.exports = { createFolderDownload };
