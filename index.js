import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { mongoConnect } from './configs/database.js';
import { isValidUser } from './middlewares/auth.js';

// import routers
import userRouter from './routers/user.router.js';
// import controllers
import commonController from './controllers/common.controller.js';

// app config
const app = express();
dotenv.config({ path: '.env' });
const PORT = process.env.PORT || 2345;

// parsing input
app.use(express.json());
app.use(cors());

// authorization
app.use(isValidUser);

// routes
app.use('/user', userRouter);
app.use('/*', commonController);

// server
app.listen(PORT, async () => {
  try {
    await mongoConnect();
    console.log('Listen at port', PORT);
  } catch (error) {
    console.log('Received error while connecting to mongodb', error);
  }
});
