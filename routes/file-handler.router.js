const express = require("express")
const { writeEnvelopesInfo } = require("../file-handlers/readWriteAPI");

const writeFileEnvelopeInfoRouter = express.Router();

writeFileEnvelopeInfoRouter.get("/", writeEnvelopesInfo);

module.exports = writeFileEnvelopeInfoRouter;

