import { Schema, model } from 'mongoose';
import bcrypt from "bcrypt";

const SALT_WORK_FACTOR = 10;

export interface IUser {
  _id: Schema.Types.ObjectId | string;
  name: string;
  username: string;
  password: string;
  role: 'user' | 'support' | 'admin';
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'support', 'admin'], default: 'user' }
}, { 
  timestamps: true, 
  autoIndex: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    }
  }
 });

UserSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

const User = model<IUser>('User', UserSchema);

export default User;