import UserService from "./user.service";
import AuthService from "./auth.service";
import SupportRequestService from "./supportRequest.service";
import SupportRequestCommentCommentService from "./supportRequestComment.service";


export const userService = new UserService();
export const authService = new AuthService();
export const supportRequestService = new SupportRequestService();
export const supportRequestCommentService = new SupportRequestCommentCommentService();