const { format, createLogger, transports } = require("winston");
const { combine, timestamp, json, errors } = format;
const path = require("path");

function buildDevLogger() {
  let logFile = path.join(path.dirname(__dirname), "logger", "logs", "file-logs.log");

  return createLogger({
    level: "debug",
    format: combine(timestamp(), errors({ stack: true }), json()),
    defaultMeta: { service: "user-service" },

    transports: [
      new transports.File({
        filename: logFile,
      }),
    ],
    exitOnError: false,
  });
}

module.exports = buildDevLogger;
