import { Request, Response } from "express";
import _ from 'lodash';
import { NotFoundError } from "../errors/NotFoundError";
import { AuthRequest } from "../types/request";
import SupportRequestCommentCommentService from "../services/supportRequestComment.service";

class SupportRequestCommentController {
  constructor(public supportRequestCommentService: SupportRequestCommentCommentService) {}

  public createSupportRequestComment = async (req: AuthRequest, res: Response) => {
    try{
      const payload = _.pick(req.body, ["message"]) as any;
      payload.supportRequest = req.params.id;
      payload.createdBy = req.user?._id;

      const supportRequest = await this.supportRequestCommentService.createSupportRequestComment(payload);

      return res.status(201).json({ data: supportRequest });
    } catch(err) {
      if(err instanceof NotFoundError) {
        return res.status(404).json({ error: err.message });
      }
      
      return res.status(500).json({ error: "Something went wrong, please contact support if issue persists!" });
    }
  };
  

  public listSupportRequestComments = async (req: Request, res: Response) => {
    try{
      const items = await this.supportRequestCommentService.listSupportRequestComments();

      return res.status(201).json({ data: items });
    } catch(err) {     
      return res.status(500).json({ error: "Something went wrong, please contact support if issue persists!" });
    }
  };
}

export default SupportRequestCommentController;
