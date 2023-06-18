import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/request";

type Roles = 'admin' | 'user' | 'support';

export function role(roles: Roles[], throwOnFail: boolean = true) {
  function role(req: AuthRequest, res: Response, next: NextFunction) {
    for(const role of roles) {
      if(req.user?.role === role) {
        return next();
      }
    }

    if(throwOnFail) {
      return res.status(403).json({ success: false, message: 'You are not autorized to view this route' });
    }

    return next();
  }

  return role;
}

