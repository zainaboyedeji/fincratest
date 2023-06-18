import { Router } from "express";
import { authController } from "../controllers";
import { validator } from "../middlewares/validator";
import Joi from "joi";
import { createAuthValidation } from "../validators/auth";

const authRouter = Router();


authRouter.post("/login", validator.body(createAuthValidation), authController.login);

export default authRouter;
