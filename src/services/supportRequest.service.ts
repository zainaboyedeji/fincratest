import { HydratedDocument } from "mongoose";
import SupportRequest, { ISupportRequest } from "../models/SupportRequest";
import { NotFoundError } from "../errors/NotFoundError";

class SupportRequestService {

  async createSupportRequest(data: { title:string; description:string;status:string, createdBy:string }): Promise<HydratedDocument<ISupportRequest>> {
    return await SupportRequest.create(data);
  }

  async listSupportRequests(filter: Partial<ISupportRequest> = {}): Promise<HydratedDocument<ISupportRequest>[]> {
    const items = await SupportRequest.find(filter).populate('assignee').populate('createdBy');

    return items;
  }

  async updateSupportRequest(id: string, data: { status?:string ;assignee?:string; }): Promise<HydratedDocument<ISupportRequest>> {
    const supportRequest = await SupportRequest.findById(id);

    if(!supportRequest) throw new NotFoundError("SupportRequest not found");

    supportRequest.set(data);

    return await supportRequest.save();
  }

}

export default SupportRequestService;
