const CONSTS = require("../helper/consts");
const Model = require("../modals/model.modal");
const commonController = require("./common.controller");


// Get Models List from BrandId
const getModelListFromBrand = () => async (req, res) => {
    req.logger.debug("Received request to get the model list from brand");
    try {
        const models = await Model.find(
            { brand: req.params.brandId },
            "_id brand type name"
        )
            .populate("brand", "name")
            .populate("type", "type")
            .lean()
            .exec();
        const message = `Fulfilled the request to get the model list from brand.`;
        req.logger.info(message);
        return res.status(CONSTS.STATUS.OK).send({ success: true, message, data: models });
    } catch (error) {
        req.logger.error(`Received error while fetching data for model list from brand`, error.message);
        return res
            .status(CONSTS.STATUS.BAD_REQUEST)
            .send({ success: false, message: error.message });
    }
}

//Get Models List from Type
const getModelListFromType = () => async (req, res) => {
    req.logger.debug("Received request to get the model list from type");
    try {
        const models = await Model.find(
            { type: req.params.typeId },
            "_id brand type name"
        )
            .populate("brand", "name")
            .populate("type", "type")
            .lean()
            .exec();
        const message = `Fulfilled the request to get the model list from type.`;
        req.logger.info(message);
        return res.status(CONSTS.STATUS.OK).send({ success: true, message, data: models });
    } catch (error) {
        req.logger.error(`Received error while fetching data for model list from type`, error.message);
        return res
            .status(CONSTS.STATUS.BAD_REQUEST)
            .send({ success: false, message: error.message });
    }
}

//Get Models List from Brand and Type
const getModelListFromBrandAndType = () => async (req, res) => {
    req.logger.debug("Received request to get the model list from brand and type");
    try {
        const models = await Model.find(
            {
                brand: req.params.brandId,
                type: req.params.typeId
            },
            "_id brand type name"
        )
            .populate("brand", "name")
            .populate("type", "type")
            .lean()
            .exec();
        const message = `Fulfilled the request to get the model list from brand and type.`;
        req.logger.info(message);
        return res.status(CONSTS.STATUS.OK).send({ success: true, message, data: models });
    } catch (error) {
        req.logger.error(`Received error while fetching data for model list from brand and type`, error.message);
        return res
            .status(CONSTS.STATUS.BAD_REQUEST)
            .send({ success: false, message: error.message });
    }
}

module.exports = {
    createModel: commonController.create(Model, (req, res) => ({ name: req.body.name })),
    getAllModels: commonController.getAll(Model, (req, res) => (
        {
            dataTobeRetrieved: "_id brand type name",
            populate1: { path: 'brand', select: 'name' },
            populate2: { path: 'type', select: 'type' }
        })
    ),
    getModelListFromBrand: getModelListFromBrand(),
    getModelListFromType: getModelListFromType(),
    getModelListFromBrandAndType: getModelListFromBrandAndType(),
    getSingleModel: commonController.getSingle(Model, (req, res) => (
        {
            query: { _id: req.params.modelId },
            dataTobeRetrieved: "_id brand type name",
            populate1: { path: 'brand', select: 'name' },
            populate2: { path: 'type', select: 'type' }
        })
    ),
    editModel: commonController.edit(Model, (req, res) => ({ _id: req.params.modelId })),
    deleteModel: commonController.deleteSingle(Model, (req, res) => ({ _id: req.params.modelId })),
    deleteAllModels: commonController.deleteAll(Model),
    notFound: commonController.notFound()
};