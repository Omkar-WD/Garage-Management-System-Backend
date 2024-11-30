const express = require("express");
const supplierController = require("../controllers/supplier.controller");

const supplierRouter = express.Router();

supplierRouter.post("/create", supplierController.createSupplier);
supplierRouter.get('/all', supplierController.getAllSuppliers);
supplierRouter.get('/:supplierId', supplierController.getSingleSupplier);
supplierRouter.patch("/edit/:supplierId", supplierController.editSupplier);
supplierRouter.delete("/delete/:supplierId", supplierController.deleteSupplier);
supplierRouter.delete("/delete-all", supplierController.deleteAllSuppliers);
supplierRouter.all("/*", supplierController.notFound);

module.exports = supplierRouter;