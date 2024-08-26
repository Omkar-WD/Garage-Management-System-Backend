const express = require("express");
const router = express.Router();
const { validationResult, Result, check } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const CONSTS = require("../helper/consts");

// Generate JWT Token
const newToken = (user) => {
  return jwt.sign({ user }, `${process.env.JWT_SECRET}`, { expiresIn: "15m" });
};

//Create User
router.post(
  "/create",
  [
    check("firstName", "Firstname should be atleast 3 characters").isLength({
      min: 3,
    }),
    check("lastName", "Lastname should be atleast 3 characters").isLength({
      min: 1,
    }),
    check("password")
      .isLength({ min: 8, max: 20 })
      .withMessage("Required min 8 characters")
      .custom((value) => {
        let pattern = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

        if (pattern.test(value)) {
          return true;
        }
      })
      .withMessage(
        "min 8 characters which contain at least one numeric digit and a special character"
      ),
  ],
  async (req, res) => {
    try {
      // error handling
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
          .send({ success: false, message: "Username already exist" });
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
  }
);

//Get Users List
router.get("/all", async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(CONSTS.STATUS.BAD_REQUEST).send({
        success: false,
        message: "Only Admin User can do this operation!",
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
});

//Get User
router.get("/", async (req, res) => {
  try {
    const user = await User.findById(
      { _id: req.user._id },
      { _id: 1, firstName: 1, lastName: 1, username: 1, isAdmin: 1 }
    )
      .lean()
      .exec();
    if (!user) throw { message: "User not exists!" };
    return res.status(CONSTS.STATUS.OK).send({ success: true, user });
  } catch (error) {
    return res
      .status(CONSTS.STATUS.BAD_REQUEST)
      .send({ success: false, message: error.message });
  }
});

//User Password Reset
router.post(
  "/resetpassword",
  [
    check("password")
      .isLength({ min: 8, max: 20 })
      .withMessage("Required min 8 characters")
      .custom((value) => {
        let pattern = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

        if (pattern.test(value)) {
          return true;
        }
      })
      .withMessage(
        "min 8 characters which contain at least one numeric digit and a special character"
      ),
  ],
  async (req, res) => {
    try {
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
      return res
        .status(CONSTS.STATUS.OK)
        .send({ success: true, message: "password updated" });
    } catch (error) {
      return res
        .status(CONSTS.STATUS.BAD_REQUEST)
        .send({ success: false, message: error.message });
    }
  }
);

//Password Reset by Admin
router.post(
  "/resetpassword/:userId",
  [
    check("password")
      .isLength({ min: 8, max: 20 })
      .withMessage("Required min 8 characters")
      .custom((value) => {
        let pattern = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

        if (pattern.test(value)) {
          return true;
        }
      })
      .withMessage(
        "min 8 characters which contain at least one numeric digit and a special character"
      ),
  ],
  async (req, res) => {
    try {
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
          messsage: errors.array()[0].msg,
        });
      }

      const user = await User.findById({ _id: req.params.userId });
      user.password = req.body.password;
      await user.save();
      return res
        .status(CONSTS.STATUS.OK)
        .send({ success: true, message: "user password updated by admin!" });
    } catch (error) {
      return res
        .status(CONSTS.STATUS.BAD_REQUEST)
        .send({ success: false, message: error.message });
    }
  }
);

// User Login
router.post("/login", async (req, res) => {
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

    res.status(CONSTS.STATUS.OK).send({ success: true, user });
  } catch (error) {
    return res
      .status(CONSTS.STATUS.BAD_REQUEST)
      .send({ success: false, message: error.message });
  }
});

// Delete User
router.delete("/delete", async (req, res) => {
  try {
    if (req.user.isAdmin) {
      return res.status(CONSTS.STATUS.BAD_REQUEST).send({
        success: false,
        message: "You Can't perform delete operation for admin user!",
      });
    }
    await User.findByIdAndDelete({ _id: req.user._id });
    res
      .status(CONSTS.STATUS.OK)
      .send({ success: true, message: "user deleted!" });
  } catch (error) {
    return res
      .status(CONSTS.STATUS.BAD_REQUEST)
      .send({ success: false, message: error.message });
  }
});

// Delete User by Admin
router.delete("/delete/:userId", async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(CONSTS.STATUS.BAD_REQUEST).send({
        success: false,
        message: "Only Admin User can do this operation!",
      });
    }
    await User.findByIdAndDelete({ _id: req.params.userId });
    res
      .status(CONSTS.STATUS.OK)
      .send({ success: true, message: "user deleted by admin!" });
  } catch (error) {
    return res
      .status(CONSTS.STATUS.BAD_REQUEST)
      .send({ success: false, message: error.message });
  }
});

module.exports = router;
