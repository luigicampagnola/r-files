/* const express = require("express");

const app = express();

const key_content = {
  hostname: "sandals.sharefile.com",
  username: "sharefile@uvltd.com",
  oldpw: "Shar3file1337",
  password: "nvyw mvcr gu4f gr2t",
  client_id: "XPrnHHkcrQwBxbaAcIneUsRigrj2MZoK",
  client_secret: "w50h7BlyBIn9YSp92Yw3MgLGr5Oa83NhJQ2dBtUKh0dW4gF2",
};

var http = require("http");

var clientId = key_content.client_id;
var client_secret = key_content.client_secret;
var redirect = key_content.hostname;

var getTokenDataPreamble = "grant_type=autorization_code&code";

var get_token_options = {
  hostname: "secure.sharefile.com",
  port: "443",
  path: "/oauth/token",
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlenconded",
    "Content-Length": 10,
  },
};

function getAuthentication(
  hostname,
  client_id,
  client_secret,
  username,
  password
) {
  const uri_path = "/oauth/token";
  const headers = get_token_options.headers;
  const params = {
    grant_type: "passoword",
    client_id: client_id,
    client_secret: client_secret,
    username: username,
    password: password,
  };

  app.post(uri_path);
} */
