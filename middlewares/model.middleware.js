
const CONSTS = require("../helper/consts");

// Middleware to set the modal name in req
const setModalNameAsModel = (req, res, next) => {
    try {
        req.modalName = CONSTS.MODALS.MODEL.NAME;
        next(); // Proceed to the next middleware or route handler
    }
    catch (error) {
        return res
            .status(CONSTS.STATUS.BAD_REQUEST)
            .send({ success: false, message: error.message, error });
    }
};

module.exports = { setModalNameAsModel };