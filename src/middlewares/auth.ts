import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import env from "../config/env";
import { IUser } from "../models/User";
import { AuthRequest } from "../types/request";


export function auth(throwOnFail: boolean = true) {
  function auth(req: AuthRequest, res: Response, next: NextFunction) {
    const authSplit = req.headers?.authorization?.split?.(' ');
    if (authSplit?.[0] === 'Bearer') {
      jwt.verify(authSplit[1], env.jwtSecret, function(err, decode) {
        if (err && throwOnFail) {
          return res.status(401).json({ success: false, message: 'You are not autorized to view this route' });
        };
        req.user = (decode as any)?.user as IUser;
        next();
      });
    }
    else {
      if(throwOnFail) {
        return res.status(401).json({ success: false, message: 'You are not autorized to view this route' });
      }
      next();
    }
  }

  return auth;
}

