const express = require("express");
const modelController = require("../controllers/model.controller");

const modelRouter = express.Router();

modelRouter.post("/create", modelController.createModel);
modelRouter.get('/all', modelController.getAllModels);
modelRouter.get('/all/brand/:brandId', modelController.getModelListFromBrand);
modelRouter.get('/all/type/:typeId', modelController.getModelListFromType);
modelRouter.get('/all/brand/:brandId/type/:typeId', modelController.getModelListFromBrandAndType);
modelRouter.get('/:modelId', modelController.getSingleModel);
modelRouter.patch("/edit/:modelId", modelController.editModel);
modelRouter.delete("/delete/:modelId", modelController.deleteModel);
modelRouter.delete("/delete-all", modelController.deleteAllModels);
modelRouter.all("/*", modelController.notFound);

module.exports = modelRouter;