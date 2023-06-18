import { Router } from "express";
import userRouter from "./user";
import authRouter from "./auth";
import supportRequestRouter from "./supportRequest";
import supportRequestCommentRouter from "./supportRequestComment";


const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/support-requests", supportRequestRouter);
router.use("/support-requests/", supportRequestCommentRouter);

export default router;