import { NextFunction, Request, Response } from "express";
import _ from 'lodash';
import AuthService from "../services/auth.service";
import { IUser } from "../models/User";
import { NotFoundError } from "../errors/NotFoundError";
import { AlreadyExistError } from "../errors/AlreadyExistError";

class AuthController {
  constructor(public authService: AuthService) {}


  public login = async (req: Request, res: Response) => {
    try{
      const payload = _.pick(req.body, [ "username", "password"]) as IUser;

      const user = await this.authService.login(payload);

      return res.status(200).json({ data: user });
    } catch(err) {
      if(err instanceof NotFoundError) {
        return res.status(404).json({ error: err.message });
      }
      
      return res.status(500).json({ error: "Something went wrong, please contact support if issue persists!" });
    }
  };
}

export default AuthController;
