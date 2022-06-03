const express = require("express")
const { getSharedEnvelopes } = require("../models/sharedEnvelopes");

const getSharedEnvelopesRouter = express.Router();

getSharedEnvelopesRouter.get("/", getSharedEnvelopes);

module.exports = getSharedEnvelopesRouter