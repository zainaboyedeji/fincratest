
import { Router } from "express";
import { supportRequestCommentController } from "../controllers";
import { validator } from "../middlewares/validator";
import Joi from "joi";

import { auth } from "../middlewares/auth";
import { role } from "../middlewares/role";
import { createSupportRequestCommentValidation } from "../validators/supportRequestComment";

const supportRequestCommentRouter = Router();

supportRequestCommentRouter.post(
  "/:id/comments",
  auth(true),
  role(["user", 'support']),
  validator.body(createSupportRequestCommentValidation),
  supportRequestCommentController.createSupportRequestComment
);

supportRequestCommentRouter.get(
  "/:id/comments",
  auth(true),
  supportRequestCommentController.listSupportRequestComments
);

export default supportRequestCommentRouter;
