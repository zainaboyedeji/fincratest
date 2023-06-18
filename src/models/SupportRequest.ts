import { PopulatedDoc, Schema, model } from 'mongoose';
import { IUser } from './User';


export interface ISupportRequest {
    _id: Schema.Types.ObjectId | string;
    title: string;
    description: string;
    status: string;
    assignee: PopulatedDoc<IUser>;
    createdBy: PopulatedDoc<IUser>;
}

const SupportRequestSchema = new Schema<ISupportRequest>({
    title: { type: String, required: true },
    description: { type: String, required: true},
    status: { type: String, enum: ['open', 'escalated', 'closed'], default: 'open' },
    assignee: { type: Schema.Types.ObjectId, ref: 'User'},
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true  },
}, { 
  timestamps: true, 
  autoIndex: true,
 });

const SupportRequest = model<ISupportRequest>('SupportRequest', SupportRequestSchema);

export default SupportRequest;