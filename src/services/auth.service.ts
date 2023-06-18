import { HydratedDocument } from "mongoose";
import User, { IUser } from "../models/User";
import bcrypt from "bcrypt";
import { NotFoundError } from "../errors/NotFoundError";
import jwt from 'jsonwebtoken';
import env from "../config/env";

class AuthService {
  async login(data: { username: string; password: string }): Promise<HydratedDocument<IUser & {token: string}>> {
    const user = await User.findOne({ username: data.username });

    if (!user) {
      throw new NotFoundError("Username or password is incorrect");
    }

    if (!(await bcrypt.compare(data.password, user.password))) {
      throw new NotFoundError("Username or password is incorrect");
    }

    const token = jwt.sign({ user }, env.jwtSecret, { expiresIn: '2d' });

    return {
      ...user.toJSON(),
      token
    };
  }
}

export default AuthService;
