import { PopulatedDoc, Schema, model } from 'mongoose';
import { IUser } from './User';
import { ISupportRequest } from './SupportRequest';


export interface ISupportRequestComment {
    _id: Schema.Types.ObjectId | string;
    supportRequest: PopulatedDoc<ISupportRequest>;
    createdBy: PopulatedDoc<IUser>;
    message: string;
}

const SupportRequestCommentSchema = new Schema<ISupportRequestComment>({
    message: { type: String, required: true },
    supportRequest: { type: Schema.Types.ObjectId, ref: 'SupportRequest', required: true  },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true  },
}, { 
  timestamps: true, 
  autoIndex: true,
 });


const SupportRequestComment = model<ISupportRequestComment>('SupportRequestComment', SupportRequestCommentSchema);

export default SupportRequestComment;