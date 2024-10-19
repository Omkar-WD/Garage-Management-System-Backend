const express = require("express");
const router = express.Router();
const CONSTS = require("../helper/consts");
const commonController = require("./common.controller");

module.exports = {
    notFound: commonController.notFound()
};