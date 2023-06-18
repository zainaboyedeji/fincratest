import { HydratedDocument, Schema ,Types} from "mongoose";
import SupportRequestComment, { ISupportRequestComment } from "../models/SupportRequestComment";
import { NotFoundError } from "../errors/NotFoundError";
import { userService } from ".";


class SupportRequestCommentCommentService {

  async createSupportRequestComment(data: { message: string, supportRequest: string, createdBy: string}): Promise<HydratedDocument<ISupportRequestComment>> {
    const user = await userService.find({
      _id: data.createdBy
    });

    if(user.role === 'user') {
      //check that a support user has already commented
      const supportUserComments = await SupportRequestComment.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'createdBy'
          }
        },
        {
          $match: {
            supportRequest: new Types.ObjectId(data.supportRequest),
            'createdBy.role': 'support'
          }
        },
        {
          $limit: 1
        }
      ]).exec();

      if(!supportUserComments.length) {
        throw new NotFoundError('You cannot comment on this support request until a support user has commented on it.');
      }
    }

    return await SupportRequestComment.create(data);
  }

  async listSupportRequestComments(): Promise<HydratedDocument<ISupportRequestComment>[]> {
    const items = await SupportRequestComment.find({}).populate('supportRequest').populate('createdBy');

    return items;
  }
}

export default SupportRequestCommentCommentService;
