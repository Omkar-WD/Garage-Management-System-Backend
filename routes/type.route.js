const express = require("express");
const typeController = require("../controllers/type.controller");

const typeRouter = express.Router();

typeRouter.post("/create", typeController.createType);
typeRouter.get('/all', typeController.getAllTypes);
typeRouter.get('/:typeId', typeController.getSingleType);
typeRouter.patch("/edit/:typeId", typeController.editType);
typeRouter.delete("/delete/:typeId", typeController.deleteType);
typeRouter.delete("/delete-all", typeController.deleteAllTypes);
typeRouter.all("/*", typeController.notFound);

module.exports = typeRouter;