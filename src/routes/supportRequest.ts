import { supportRequestController } from "./../controllers/index";
import { Router } from "express";
import { userController } from "../controllers";
import { validator } from "../middlewares/validator";
import Joi from "joi";
import {
  createSupportRequestValidation,
  updateSupportRequestValidation,
} from "../validators/supportRequest";
import { auth } from "../middlewares/auth";
import { role } from "../middlewares/role";

const supportRequestRouter = Router();

supportRequestRouter.post(
  "/",
  auth(true),
  role(["user"]),
  validator.body(createSupportRequestValidation),
  supportRequestController.createSupportRequest
);

supportRequestRouter.get(
  "/",
  auth(true),
  role(["support", "admin"]),
  supportRequestController.listSupportRequests
);

supportRequestRouter.patch(
  "/:id",
  auth(true),
  role(["support", "admin"]),
  validator.body(updateSupportRequestValidation),
  supportRequestController.updateSupportRequest
);

supportRequestRouter.get(
  "/report/:format",
  auth(true),
  role(["support", "admin"]),
  supportRequestController.exportSupportRequest
);

export default supportRequestRouter;
