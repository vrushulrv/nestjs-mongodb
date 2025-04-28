import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export const UserSchema = new mongoose.Schema({
    email: {
      type: String,
      unique: true,
      required: true
    },
    name: {
      type: String
    },
    password: {
      type: String,
      required: true
    },
    attempt: { 
      type: Number, 
      required: true
    },
    isDeleted: {
      type: Boolean,
      required: true
    },
    updatedAt: {
      type: Number,
      required: false
    },
    createdAt: {
      type: Number,
      required: true
    }
})

UserSchema.pre('save', async function(next: mongoose.HookNextFunction) {
    try {
      if (!this.isModified('password')) {
        return next();
      }
      const hashed = await bcrypt.hash(this['password'], 10);
      this['password'] = hashed;
      return next();
    } catch (err) {
      return next(err);
    }
  });