import { userService, authService , supportRequestService, supportRequestCommentService } from "../services";
import UserController from "./user.controller";
import AuthController from "./auth.controller";
import SupportRequestController from "./supportRequest.controller";
import SupportRequestCommentController from "./supportRequestComment.controller";


export const userController = new UserController(userService);
export const authController = new AuthController(authService);
export const supportRequestController = new SupportRequestController(supportRequestService);
export const supportRequestCommentController = new SupportRequestCommentController(supportRequestCommentService);