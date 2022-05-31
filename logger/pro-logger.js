const { format, createLogger, transports } = require("winston");
const { combine, timestamp, errors, colorize, json } = format;

function buildProdLogger() {

  return createLogger({
    level: "debug",
    format: combine(
      colorize(),
      timestamp(),
      errors({ stack: true }),
      json()
    ),
    defaultMeta: { service: "user-service" },
    transports: [new transports.Console()],
  });
}

module.exports = buildProdLogger;
