import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

export const mongoConnect =  () => {
  return mongoose.connect(process.env.MONGO_URL);
};
