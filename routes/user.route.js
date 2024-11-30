const express = require("express");
const { check } = require("express-validator");
const userController = require("../controllers/user.controller");

const userRouter = express.Router();
userRouter.post("/login", userController.login);
userRouter.post("/create",
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
    userController.createUser);
userRouter.get("/all", userController.getAllUsers);
userRouter.get("/:userId", userController.getSingleUser);
userRouter.patch("/edit/:userId", userController.editUser);
userRouter.delete("/delete/:userId", userController.deleteUser);
userRouter.delete("/delete-all", userController.deleteAllUsers);
userRouter.post("/resetpassword/:userId",
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
    userController.resetPasswordByAdmin);
userRouter.post("/resetpassword",
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
    userController.resetPassword);
userRouter.all("/*", userController.notFound);

module.exports = userRouter;