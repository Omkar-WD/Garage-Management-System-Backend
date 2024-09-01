// user.router.js
import { Router } from 'express';
import { check } from 'express-validator';
import {
  createUser,
  getUsersList,
  getUser,
  resetUserPassword,
  adminResetPassword,
  loginUser,
  deleteUser,
  adminDeleteUser,
} from '../controllers/user.controller.js';

const userRouter = Router();

// Define the create user route
userRouter.post(
  '/create',
  [
    check('firstName', 'Firstname should be at least 3 characters').isLength({
      min: 3,
    }),
    check('lastName', 'Lastname should be at least 3 characters').isLength({
      min: 1,
    }),
    check('password')
      .isLength({ min: 8, max: 20 })
      .withMessage('Required min 8 characters')
      .custom((value) => {
        let pattern = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

        if (pattern.test(value)) {
          return true;
        }
      })
      .withMessage(
        'min 8 characters which contain at least one numeric digit and a special character'
      ),
  ],
  createUser
);

// Get users list route
userRouter.get('/all', getUsersList);

// Get user route
userRouter.get('/', getUser);

// User Password Reset Route
userRouter.post(
  '/resetpassword',
  [
    check('password')
      .isLength({ min: 8, max: 20 })
      .withMessage('Required min 8 characters')
      .custom((value) => {
        let pattern = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (pattern.test(value)) {
          return true;
        }
      })
      .withMessage(
        'min 8 characters which contain at least one numeric digit and a special character'
      ),
  ],
  resetUserPassword
);

// Password Reset by Admin Route
userRouter.post(
  '/resetpassword/:userId',
  [
    check('password')
      .isLength({ min: 8, max: 20 })
      .withMessage('Required min 8 characters')
      .custom((value) => {
        let pattern = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (pattern.test(value)) {
          return true;
        }
      })
      .withMessage(
        'min 8 characters which contain at least one numeric digit and a special character'
      ),
  ],
  adminResetPassword
);

// User Login Route
userRouter.post('/login', loginUser);

// Delete User Route
userRouter.delete('/delete', deleteUser);

// Delete User by Admin Route
userRouter.delete('/delete/:userId', adminDeleteUser);

export default userRouter;
