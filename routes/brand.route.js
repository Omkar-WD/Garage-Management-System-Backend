const express = require("express");
const brandController = require("../controllers/brand.controller");

const brandRouter = express.Router();

brandRouter.post("/create", brandController.createBrand);
brandRouter.get('/all', brandController.getAllBrands);
brandRouter.get('/:brandId', brandController.getSingleBrand);
brandRouter.patch("/edit/:brandId", brandController.editBrand);
brandRouter.delete("/delete/:brandId", brandController.deleteBrand);
brandRouter.all("/*", brandController.notFound);

module.exports = brandRouter;