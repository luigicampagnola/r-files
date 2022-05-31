const buildDevLogger = require("./dev-logger");
const buildProdLogger = require("./pro-logger");

let logger = null;

if(process.env.NODE_ENV === "development"){
    logger = buildDevLogger();
} else {
    logger = buildProdLogger();
}
module.exports = buildDevLogger();