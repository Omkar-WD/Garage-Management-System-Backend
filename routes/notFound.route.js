const express = require("express");
const notFoundController = require("../controllers/notFound.controller");

const notFoundRouter = express.Router();
notFoundRouter.all('/', notFoundController.notFound);

module.exports = notFoundRouter;