const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const CONSTS = require("../helper/consts");
const User = require("../modals/user.modal");
const commonController = require("./common.controller");

// Generate JWT Token
const newToken = (user) => {
  return jwt.sign({ user }, `${process.env.JWT_SECRET}`, { expiresIn: "15m" });
};

const login = () => async (req, res) => {
  req.logger.debug("Received request for login");
  try {
    // error handling
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(CONSTS.STATUS.BAD_REQUEST).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }
    let user = await User.findOne({ username: req.body.username });

    // If user is not found then return error
    if (!user)
      return res.status(CONSTS.STATUS.BAD_REQUEST).send({
        success: false,
        message: "Username or Password is incorrect!",
      });

    // if user is found then we will match the passwords
    const match = user.checkPassword(req.body.password);

    if (!match)
      return res
        .status(CONSTS.STATUS.BAD_REQUEST)
        .send({ success: false, message: "Password is incorrect!" });

    const token = newToken(user);

    user = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      isAdmin: user.isAdmin,
      token,
    };
    const message = `Fulfilled the login request.`;
    req.logger.info(message);
    res.status(CONSTS.STATUS.OK).send({ success: true, user });
  } catch (error) {
    req.logger.error(`Received error while logging in`, error.message);
    return res
      .status(CONSTS.STATUS.BAD_REQUEST)
      .send({ success: false, message: error.message });
  }
}

const resetPasswordByAdmin = () => async (req, res) => {
  try {
    req.logger.debug("Received request to reset the password by admin");
    if (!req.user.isAdmin) {
      return res.status(CONSTS.STATUS.BAD_REQUEST).send({
        success: false,
        message: "Only Admin User can reset the password for other users!",
      });
    }
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(CONSTS.STATUS.BAD_REQUEST).json({
        success: false,
        messsage: errors.array()[0]?.msg,
      });
    }

    const user = await User.findById({ _id: req.params.userId });
    user.password = req.body.password;
    await user.save();
    const message = `user's password updated by admin!`;
    req.logger.info(message);
    return res
      .status(CONSTS.STATUS.OK)
      .send({ success: true, message });
  } catch (error) {
    req.logger.error(`Received error while resetting the password by admin`, error.message);
    return res
      .status(CONSTS.STATUS.BAD_REQUEST)
      .send({ success: false, message: error.message });
  }
}

const resetPassword = () => async (req, res) => {
  try {
    req.logger.debug("Received request to reset the password");
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(CONSTS.STATUS.BAD_REQUEST).json({
        success: false,
        messsage: errors.array()[0].msg,
      });
    }

    const user = await User.findById({ _id: req.user._id });
    user.password = req.body.password;
    await user.save();
    const message = `user's password updated!`;
    req.logger.info(message);
    return res
      .status(CONSTS.STATUS.OK)
      .send({ success: true, message });
  } catch (error) {
    req.logger.error(`Received error while resetting the password`, error.message);
    return res
      .status(CONSTS.STATUS.BAD_REQUEST)
      .send({ success: false, message: error.message });
  }
}

module.exports = {
  login: login(),
  createUser: commonController.create(User, (req, res) => ({ username: req.body.username })),
  getAllUsers: commonController.getAll(User, (req, res) => (
    {
      dataTobeRetrieved: "_id firstName lastName username isAdmin"
    })
  ),
  getSingleUser: commonController.getSingle(User, (req, res) => ({ query: { _id: req.params.userId }, dataTobeRetrieved: "_id firstName lastName username isAdmin" })),
  editUser: commonController.edit(User, (req, res) => ({ _id: req.params.userId })),
  deleteUser: commonController.deleteSingle(User, (req, res) => ({ _id: req.params.userId })),
  resetPasswordByAdmin: resetPasswordByAdmin(),
  resetPassword: resetPassword(),
  notFound: commonController.notFound()
};