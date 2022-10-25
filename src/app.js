const express = require("express");
const app = express();
const logger = require("../logger");

const retrieveRouter = require("../routes/retrieve.router");
const writeFileEnvelopeInfoRouter = require("../routes/file-handler.router");
const getSharedEnvelopesRouter = require("../routes/sharedEnvelopes.router");

app.use(express.json());
const fs = require("fs");
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

/* -------------------------------------------> A U T H E N T I C A T I O N -------------------------------------------> */

/* REQ TO GET AUTH CODE */
app.get("/auth", (req, res) => {

  /* Req to get the Auth Code */
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




/* <---- REQ TO GET ACCESS-TOKEN ----> */
app.get("/oauth-callback", ({ query: { code } }, res) => {

  /* Stored authentication code  */
  let authCode = code;

  /* Exchanging authentication code for the access token object */
  apiClient
    .generateAccessToken(integrationKey, secretKey, authCode)
    .then(function (oAuthToken) {
      console.log(oAuthToken);


      /* Creating a data folder if it doens't exits */
      if (oAuthToken) {
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath);
          logger.info("Started" + oAuthToken);
        }
      }

      /* Creating the access-token.json file */
      let writeToken = fs.createWriteStream(folderPath + "access-token.json");


      /* Writing the access token object on the access-token.json file */
      writeToken.write(JSON.stringify(oAuthToken, null, 2));


      /* Req to get user's account info */
      apiClient.getUserInfo(oAuthToken.accessToken).then(function (userInfo) {
        //console.log(userInfo);

        /* Creting data folder */
        if (userInfo) {
          if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
          }
        }

        /* Creating user-info.json file */
        let writer = fs.createWriteStream(folderPath + "user-Info.json");

        /* Write the information on the user-info.json file */
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
