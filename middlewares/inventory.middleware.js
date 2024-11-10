
const CONSTS = require("../helper/consts");

// Middleware to set the modal name in req
const setModalNameAsInventory = (req, res, next) => {
    try {
        req.modalName = CONSTS.MODALS.INVENTORY.NAME;
        next(); // Proceed to the next middleware or route handler
    }
    catch (error) {
        return res
            .status(CONSTS.STATUS.BAD_REQUEST)
            .send({ success: false, message: error.message, error });
    }
};

module.exports = { setModalNameAsInventory };