const express = require("express")
const { getEnvelopesInfo } = require("../file-handlers/reader-handler/readerHandler");

const getEnvelopesInfoRouter = express.Router();

getEnvelopesInfoRouter.get("/", getEnvelopesInfo);

module.exports = getEnvelopesInfoRouter;

