const express = require("express");
const router = express.Router();
const { validationResult, Result, check } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const CONSTS = require("../helper/consts");

//Not Found Page
router.all("/", async (req, res) => {
  try {
    return res
      .status(CONSTS.STATUS.NOT_FOUND)
      .send({ success: true, message: "Not Found!" });
  } catch (error) {
    return res
      .status(CONSTS.STATUS.BAD_REQUEST)
      .send({ success: false, message: error.message });
  }
});

module.exports = router;
