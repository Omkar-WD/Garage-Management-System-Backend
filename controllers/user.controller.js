import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/user.model.js';
import { CONSTS } from '../helper/consts.js';

// Generate JWT Token
export const newToken = (user) => {
  return jwt.sign({ user }, `${process.env.JWT_SECRET}`, { expiresIn: '15m' });
};

// Create User Controller Function
export const createUser = async (req, res) => {
  try {
    // Error handling
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(CONSTS.STATUS.BAD_REQUEST).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    let user = await User.findOne({ username: req.body.username })
      .lean()
      .exec();

    if (user) {
      return res
        .status(CONSTS.STATUS.BAD_REQUEST)
        .send({ success: false, message: 'Username already exists' });
    }

    user = await User.create(req.body);

    const { _id, firstName, lastName, username, isAdmin } = user;

    return res.status(CONSTS.STATUS.CREATED).send({
      success: true,
      user: { _id, firstName, lastName, username, isAdmin },
    });
  } catch (error) {
    return res
      .status(CONSTS.STATUS.BAD_REQUEST)
      .send({ success: false, message: error.message });
  }
};

// Get Users List Controller Function
export const getUsersList = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(CONSTS.STATUS.BAD_REQUEST).send({
        success: false,
        message: 'Only Admin User can do this operation!',
      });
    }

    const users = await User.find(
      {},
      { _id: 1, firstName: 1, lastName: 1, username: 1, isAdmin: 1 }
    )
      .lean()
      .exec();

    return res.status(CONSTS.STATUS.OK).send({ success: true, users });
  } catch (error) {
    return res
      .status(CONSTS.STATUS.BAD_REQUEST)
      .send({ success: false, message: error.message });
  }
};

// Get User Controller Function
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(
      { _id: req.user._id },
      { _id: 1, firstName: 1, lastName: 1, username: 1, isAdmin: 1 }
    )
      .lean()
      .exec();

    if (!user) throw { message: 'User does not exist!' };

    return res.status(CONSTS.STATUS.OK).send({ success: true, user });
  } catch (error) {
    return res
      .status(CONSTS.STATUS.BAD_REQUEST)
      .send({ success: false, message: error.message });
  }
};

// User Password Reset Controller Function
export const resetUserPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(CONSTS.STATUS.BAD_REQUEST).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const user = await User.findById({ _id: req.user._id });
    user.password = req.body.password;
    await user.save();
    return res
      .status(CONSTS.STATUS.OK)
      .send({ success: true, message: 'Password updated' });
  } catch (error) {
    return res
      .status(CONSTS.STATUS.BAD_REQUEST)
      .send({ success: false, message: error.message });
  }
};

// Password Reset by Admin Controller Function
export const adminResetPassword = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(CONSTS.STATUS.BAD_REQUEST).send({
        success: false,
        message: 'Only Admin User can reset the password for other users!',
      });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(CONSTS.STATUS.BAD_REQUEST).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const user = await User.findById({ _id: req.params.userId });
    user.password = req.body.password;
    await user.save();
    return res
      .status(CONSTS.STATUS.OK)
      .send({ success: true, message: 'User password updated by admin!' });
  } catch (error) {
    return res
      .status(CONSTS.STATUS.BAD_REQUEST)
      .send({ success: false, message: error.message });
  }
};

// User Login Controller Function
export const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(CONSTS.STATUS.BAD_REQUEST).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    let user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(CONSTS.STATUS.BAD_REQUEST).send({
        success: false,
        message: 'Username or Password is incorrect!',
      });
    }

    const match = user.checkPassword(req.body.password);

    if (!match) {
      return res
        .status(CONSTS.STATUS.BAD_REQUEST)
        .send({ success: false, message: 'Password is incorrect!' });
    }

    const token = newToken(user);

    user = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      isAdmin: user.isAdmin,
      token,
    };

    res.status(CONSTS.STATUS.OK).send({ success: true, user });
  } catch (error) {
    return res
      .status(CONSTS.STATUS.BAD_REQUEST)
      .send({ success: false, message: error.message });
  }
};

// Delete User Controller Function
export const deleteUser = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      return res.status(CONSTS.STATUS.BAD_REQUEST).send({
        success: false,
        message: "You can't perform delete operation for admin user!",
      });
    }
    await User.findByIdAndDelete({ _id: req.user._id });
    res
      .status(CONSTS.STATUS.OK)
      .send({ success: true, message: 'User deleted!' });
  } catch (error) {
    return res
      .status(CONSTS.STATUS.BAD_REQUEST)
      .send({ success: false, message: error.message });
  }
};

// Delete User by Admin Controller Function
export const adminDeleteUser = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(CONSTS.STATUS.BAD_REQUEST).send({
        success: false,
        message: 'Only Admin User can do this operation!',
      });
    }
    await User.findByIdAndDelete({ _id: req.params.userId });
    res
      .status(CONSTS.STATUS.OK)
      .send({ success: true, message: 'User deleted by admin!' });
  } catch (error) {
    return res
      .status(CONSTS.STATUS.BAD_REQUEST)
      .send({ success: false, message: error.message });
  }
};
