const express = require("express");
const app = express();
const logger = require("../logger/dev-logger");

const retrieveRouter = require("../routes/retrieve.router");
const writeFileEnvelopeInfoRouter = require("../routes/file-handler.router");
const getSharedEnvelopesRouter = require("../routes/sharedEnvelopes.router");

app.use(express.json());
const fs = require("fs");
var axios = require("axios").default;
const path = require("path");
const folderPath = path.dirname(__dirname) + "/data/";
let docusign = require("docusign-esign");
const { basePath, integrationKey, secretKey } = require("../data/data");
let oAuth = docusign.ApiClient.OAuth;
let oAuthBasePath = oAuth.BasePath.DEMO;
let RedirectUri = "http://localhost:4004/oauth-callback";

let apiClient = new docusign.ApiClient({
  basePath: basePath,
  oAuthBasePath: oAuthBasePath,
});

//console.log(basePath)
let responseType = apiClient.OAuth.ResponseType.CODE;
let scopes = [apiClient.OAuth.Scope.SIGNATURE];

let randomState = "*^.$DGj*)+}Jk";

app.get("/auth", (req, res) => {
  let authUri = apiClient.getAuthorizationUri(
    integrationKey,
    scopes,
    RedirectUri,
    responseType,
    randomState
  );

  console.log(authUri);
  res.redirect(authUri);
});

app.post("/auth");
app.get("/oauth-callback", ({ query: { code } }, res) => {
  //res.send(code);
  //console.log(code);
  let authCode = code;
  apiClient
    .generateAccessToken(integrationKey, secretKey, authCode)
    .then(function (oAuthToken) {
      console.log(oAuthToken);
      if (oAuthToken) {
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath);
          logger.info("Started" + oAuthToken);
        }
      }
      let writeToken = fs.createWriteStream(folderPath + "access-token.json");
      writeToken.write(JSON.stringify(oAuthToken, null, 2));


      apiClient.getUserInfo(oAuthToken.accessToken).then(function (userInfo) {
        //console.log(userInfo);
        if (userInfo) {
          if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
          }
        }
        let writer = fs.createWriteStream(folderPath + "user-Info.json");
        writer.write(JSON.stringify(userInfo, null, 2));
      });
    });

  res.end();
});



//app.use("/redirect", loginRouter);
app.use("/shared", getSharedEnvelopesRouter);
app.use("/retrieve", retrieveRouter);
app.use("/file-handler", writeFileEnvelopeInfoRouter);

module.exports = app;
