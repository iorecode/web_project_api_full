const winston = require("winston");
const expressWinston = require("express-winston");
const logger = require("../logger");

const requestLogger = expressWinston.logger({
  winstonInstance: logger,
  msg: "HTTP {{req.method}} {{req.url}}",
  meta: true,
  expressFormat: true,
  colorize: false,
  level: "info",
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  winstonInstance: logger,
  msg: "HTTP error: {{err.message}} at {{req.url}} using {{req.method}}",
  meta: true,
  colorize: false,
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};
