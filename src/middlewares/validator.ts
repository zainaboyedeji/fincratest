import { body, ValidationChain, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";

import {createValidator} from 'express-joi-validation';

export const validator = createValidator({
  passError: true,
  joi: {
    convert: true,
  }
})
