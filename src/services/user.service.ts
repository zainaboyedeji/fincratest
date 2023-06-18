import { HydratedDocument } from "mongoose";
import User, { IUser } from "../models/User";
import bcrypt from "bcrypt";
import { NotFoundError } from "../errors/NotFoundError";
import { AlreadyExistError } from "../errors/AlreadyExistError";

class UserService {
  async findAllUsers(): Promise<HydratedDocument<IUser>[]> {
    return await User.find({});
  }

  async find(filter: Partial<IUser>): Promise<HydratedDocument<IUser>> {
    const user = await User.findOne(filter);
    if (!user) {
      throw new NotFoundError("User does not exist");
    }
    return user;
  }

  async createUser(data: { name: string; username: string; password: string }): Promise<HydratedDocument<IUser>> {
    const user = await User.findOne({ username: data.username });

    if(user) {
      throw new AlreadyExistError("User already exists");
    }

    return await User.create(data);
  }
}

export default UserService;
