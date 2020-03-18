import { RequestModel } from "../models";

export default class RequestService {
  categoryPath: { path: string; select: string };

  ratingsPath: { path: string; populate: { path: string } };

  agentPath: { path: string; populate: { path: string; populate: any[] } };

  servicePath: { path: string; populate: any[] };

  bookingsPath: { path: string; populate: any[] };

  constructor() {
    this.categoryPath = {
      path: "category",
      select: "_id name iconUrl",
    };
    this.ratingsPath = {
      path: "serviceRatings",
      populate: { path: "user" },
    };
    this.agentPath = {
      path: "agent",
      populate: {
        path: "services",
        populate: [this.categoryPath, this.ratingsPath],
      },
    };
    this.servicePath = {
      path: "service",
      populate: [this.categoryPath, this.ratingsPath],
    };
    this.bookingsPath = {
      path: "bookings",
      populate: [this.agentPath, this.servicePath],
    };
  }

  saveRequest(newRequest) {
    return newRequest.save();
  }

  getRequestById(id) {
    return RequestModel.findById(id)
      .populate(this.bookingsPath)
      .exec();
  }
}
