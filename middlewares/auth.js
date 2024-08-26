const jwt = require("jsonwebtoken");
const CONSTS = require("../helper/consts");

// Middleware to check JWT
const isValidUser = async (req, res, next) => {
  try {
    if (CONSTS.SKIP_AUTHORIZATION.includes(req.originalUrl)) {
      return next();
    }

    // Get token from headers
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token)
      return res
        .status(CONSTS.STATUS.UNAUTHORIZED)
        .send({ success: false, message: "Unauthorized User" }); // No token provided
    const retrievedJWTData = jwt.verify(token, process.env.JWT_SECRET);
    if (!retrievedJWTData.user)
      return res
        .status(CONSTS.STATUS.BAD_REQUEST)
        .send({ success: false, message: "User not exists!" });
    req.user = retrievedJWTData.user; // Attach user info to request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res
      .status(CONSTS.STATUS.FORBIDDEN)
      .send({ success: false, message: error.message }); // Invalid or expired token
  }
};

module.exports = isValidUser;
