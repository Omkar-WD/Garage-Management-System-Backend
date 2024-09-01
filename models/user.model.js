import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, require: false, default: false },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  const hash = bcrypt.hashSync(this.password, 8);
  this.password = hash;

  return next();
});

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('user', userSchema);
export default User;
