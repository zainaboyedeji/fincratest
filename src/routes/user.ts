import { Router } from "express";
import { userController } from "../controllers";
import { validator } from "../middlewares/validator";
import Joi from "joi";
import { createUserValidation } from "../validators/user";
import { auth } from "../middlewares/auth";
import { role } from "../middlewares/role";

const userRouter = Router();


userRouter.get("/", auth(true), role(['admin']), userController.getUsers);

userRouter.post("/", auth(false), validator.body(createUserValidation), userController.createUser);

export default userRouter;
