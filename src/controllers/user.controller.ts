import { NextFunction, Request, Response } from "express";
import _ from 'lodash';
import UserService from "../services/user.service";
import { IUser } from "../models/User";
import { NotFoundError } from "../errors/NotFoundError";
import { AlreadyExistError } from "../errors/AlreadyExistError";
import { AuthRequest } from "../types/request";

class UserController {
  constructor(public userService: UserService) {}

  public getUsers = async (req: Request, res: Response) => {
    try{
      const users = await this.userService.findAllUsers();
      return res.status(200).json(users);
    } catch(err) {   
      return res.status(500).json({ error: "Something went wrong, please contact support if issue persists!" });
    }
  };

  public createUser = async (req: AuthRequest, res: Response) => {
    try{
      const payload = _.pick(req.body, ["name", "username", "password", "role"]) as IUser;

      if(payload.role !== 'user' && req.user?.role !== 'admin') {
        return res.status(403).json({ error: "You are not authorized to create a user with this role!" });
      }

      const user = await this.userService.createUser(payload);

      return res.status(201).json({ data: user });
    } catch(err) {
      if(err instanceof AlreadyExistError) {
        return res.status(404).json({ error: err.message });
      }
      
      return res.status(500).json({ error: "Something went wrong, please contact support if issue persists!" });
    }
  };
}

export default UserController;
