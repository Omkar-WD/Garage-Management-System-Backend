const express = require("express");
const quotationController = require("../controllers/quotation.controller");

const quotationRouter = express.Router();

quotationRouter.post("/create", quotationController.createQuotation);
quotationRouter.get('/all', quotationController.getAllQuotations);
quotationRouter.get('/:quotationId', quotationController.getSingleQuotation);
quotationRouter.patch("/edit/:quotationId", quotationController.editQuotation);
quotationRouter.delete("/delete/:quotationId", quotationController.deleteQuotation);
quotationRouter.all("/*", quotationController.notFound);

module.exports = quotationRouter;