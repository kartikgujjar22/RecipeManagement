const fs = require("fs");
const path = require("path");
const winston = require("winston");
const morgan = require("morgan");

const logDir = "logs";

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Winston logger setup
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      (info) =>
        `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, "backend.log") }),
  ],
});

// HTTP request logger middleware using morgan
const stream = {
  write: (message) => logger.info(message.trim()),
};

// Combine morgan with winston
const httpLogger = morgan(
  ":method :url :status :response-time ms - :res[content-length]",
  { stream }
);

// Export the logger and httpLogger using CommonJS syntax
module.exports = { httpLogger, logger };
