const express = require("express")
const { getSharedEnvelopes } = require("../models/getSharedEnvelopes");

const getSharedEnvelopesRouter = express.Router();

getSharedEnvelopesRouter.get("/", getSharedEnvelopes);

module.exports = getSharedEnvelopesRouter