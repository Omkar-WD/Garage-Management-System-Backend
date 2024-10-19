
const CONSTS = require("../helper/consts");
const winston = require("winston");

// Middleware to add logger in req
const logger = (req, res, next) => {
    try {
        const logger = winston.createLogger({
            level: 'debug', // Set the default log level
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
            transports: [
                new winston.transports.Console(), // Log to console
            ],
        });
        req.logger = logger;
        next(); // Proceed to the next middleware or route handler
    }
    catch (error) {
        return res
            .status(CONSTS.STATUS.BAD_REQUEST)
            .send({ success: false, message: error.message, error });
    }
};

module.exports = logger;
