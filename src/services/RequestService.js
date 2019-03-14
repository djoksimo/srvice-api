const { RequestModel } = require("../models");

class RequestService {

  constructor() {
    this.categoryPath = { path: "category", select: "_id name" };
    this.ratingsPath = {
      path: "ratings",
      populate: { path: "user" },
    };
    this.agentPath = {
      path: "agent",
      populate: {
        path: "services",
        populate: [
          this.categoryPath,
          this.ratingsPath,
        ]
      },
    };
    this.servicePath = {
      path: "service",
      populate: [
        this.categoryPath,
        this.ratingsPath,
      ],
    };
    this.bookingsPath = {
      path: "bookings",
      populate: [
        this.agentPath,
        this.servicePath,
      ],
    };
  }

  createRequest(newRequest) {
    return newRequest.save();
  }

  getRequestById(id) {
    return RequestModel.findById(id).populate(this.bookingsPath).exec();
  }
}

module.exports = RequestService;