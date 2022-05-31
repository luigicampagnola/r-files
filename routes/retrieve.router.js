const express = require("express");
const { retrieveController } = require("../controllers/retrieve.controller");

const retrieveRouter = express.Router();

retrieveRouter.get("/", retrieveController)


module.exports = retrieveRouter;
