const { validationResult, Result, check } = require("express-validator");
const _ = require("lodash");
const CONSTS = require("../helper/consts");

const create = (Modal, callback) => async (req, res) => {
  const modalName = req.modalName;
  try {
    req.logger.debug(`Received request to create ${modalName}`);
    // error handling
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.logger.error(`Received error on validation ${errors}`);
      return res.status(CONSTS.STATUS.BAD_REQUEST).json({
        success: false,
        message: errors?.array()[0]?.msg,
      });
    }
    const query = callback(req, res);
    if (!_.isEmpty(query)) {
      req.logger.info(`Received query to find the data ${query}`);
      let data = await Modal.findOne(query)
        .lean()
        .exec();

      if (data) {
        const message = `${modalName} already exist`;
        req.logger.error(message);
        return res
          .status(CONSTS.STATUS.BAD_REQUEST)
          .send({ success: false, message });
      }
    }

    data = await Modal.create(req.body);
    const message = `${modalName} created`;
    req.logger.info(message);
    return res.status(CONSTS.STATUS.CREATED).send({
      success: true,
      message
    });
  } catch (error) {
    req.logger.error(`Received error while creating the ${modalName}`, error.message);
    return res
      .status(CONSTS.STATUS.BAD_REQUEST)
      .send({ success: false, message: error.message });
  }
};

const getAll = (Modal, callback) => async (req, res) => {
  const modalName = req.modalName;
  try {
    req.logger.debug(`Received request to get all ${modalName}'s data`);
    const callbackData = callback();
    const data = await Modal.find({}, callbackData.dataTobeRetrieved)
      .populate(callbackData.populate1)
      .populate(callbackData.populate2)
      .populate(callbackData.populate3)
      .populate(callbackData.populate4)
      .populate(callbackData.populate5)
      .lean()
      .exec();

    req.logger.info(`Request fulfilled for getting all ${modalName}'s data`);
    return res.status(CONSTS.STATUS.OK).send({ success: true, data });
  } catch (error) {
    req.logger.error(`Received error while fetching ${modalName}'s data`, error);
    return res
      .status(CONSTS.STATUS.BAD_REQUEST)
      .send({ success: false, message: error.message });
  }
}

const getSingle = (Modal, callback) => async (req, res) => {
  const modalName = req.modalName;
  try {
    req.logger.debug(`Received request to get the ${modalName} data`);
    const callbackData = callback(req, res);
    req.logger.info(`Received query to find the data ${callbackData.query}`);
    const data = await Modal.findOne(callbackData.query, callbackData.dataTobeRetrieved)
      .populate(callbackData.populate1)
      .populate(callbackData.populate2)
      .populate(callbackData.populate3)
      .populate(callbackData.populate4)
      .populate(callbackData.populate5)
      .lean()
      .exec();
    req.logger.info(`Request fulfilled for getting the ${modalName} data`);
    return res.status(CONSTS.STATUS.OK).send({ success: true, data });
  } catch (error) {
    req.logger.error(`Received error while fetching ${modalName} data`, error);
    return res
      .status(CONSTS.STATUS.BAD_REQUEST)
      .send({ success: false, message: error.message });
  }
}

const edit = (Modal, callback) => async (req, res) => {
  const modalName = req.modalName;
  try {
    req.logger.debug(`Received request to update the ${modalName} data`);
    const query = callback(req, res);
    req.logger.info(`Received query to find the data ${query}`);
    const updatedData = await Modal.findByIdAndUpdate(query, req.body, { new: true, runValidators: true });
    if (!updatedData) {
      req.logger.error(`Received error while updating the data of ${modalName}`);
      return res.status(CONSTS.STATUS.BAD_REQUEST).send(`${modalName} not found`);
    }
    const message = `${modalName} details updated!`;
    req.logger.info(message);
    return res
      .status(CONSTS.STATUS.OK)
      .send({ success: true, message });
  }
  catch (error) {
    req.logger.error(`Received error while updating ${modalName} data`, error);
    return res
      .status(CONSTS.STATUS.BAD_REQUEST)
      .send({ success: false, message: error.message });
  }
};

const deleteSingle = (Modal, callback) => async (req, res) => {
  const modalName = req.modalName;
  try {
    req.logger.debug(`Received request to delete the ${modalName} data`);
    if (!req.user.isAdmin) {
      req.logger.error(`Only Admin User can delete the data for ${modalName}`);
      return res.status(CONSTS.STATUS.BAD_REQUEST).send({
        success: false,
        message: "Only Admin User can do this operation!",
      });
    }
    const query = callback(req, res);
    req.logger.info(`Received query to find the data ${query}`);
    await Modal.findOneAndDelete(query);
    const message = `${modalName} deleted by admin!`;
    req.logger.info(message);
    return res
      .status(CONSTS.STATUS.OK)
      .send({ success: true, message });
  } catch (error) {
    req.logger.error(`Received error while deleting ${modalName} data`, error);
    return res
      .status(CONSTS.STATUS.BAD_REQUEST)
      .send({ success: false, message: error.message });
  }
};

const deleteAll = (Modal) => async (req, res) => {
  const modalName = req.modalName;
  try {
    req.logger.debug(`Received request to delete all the ${modalName}s data`);
    if (!req.user.isAdmin) {
      req.logger.error(`Only Admin User can delete all the data for ${modalName}`);
      return res.status(CONSTS.STATUS.BAD_REQUEST).send({
        success: false,
        message: "Only Admin User can do this operation!",
      });
    }
    const result = await Modal.deleteMany({});
    if (result.deletedCount === 0) {
      req.logger.info(`No data found to delete for ${modalName}`);
      return res.status(CONSTS.STATUS.OK).send({ success: true, message: 'No data found to delete.' });
    }
    const message = `all data of ${modalName} deleted by admin!`;
    req.logger.info(message);
    return res
      .status(CONSTS.STATUS.OK)
      .send({ success: true, message });
  } catch (error) {
    req.logger.error(`Received error while deleting ${modalName}s data`, error);
    return res
      .status(CONSTS.STATUS.BAD_REQUEST)
      .send({ success: false, message: error.message });
  }
};

const notFound = () => (req, res) => {
  const message = "No route Found!";
  req.logger.error(message);
  return res
    .status(CONSTS.STATUS.NOT_FOUND)
    .send({ success: false, message });
};

module.exports = { create, getAll, getSingle, edit, deleteSingle, deleteAll, notFound };