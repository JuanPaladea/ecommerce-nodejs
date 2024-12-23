import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "error",
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new transports.File({ filename: "src/logs/app.log", level: "error" }),
  ],
  });

export default logger;