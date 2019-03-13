const { AgentPrivateModel } = require("../models");

class AgentPrivateService {
  createAgentPrivate(newAgentPrivate) {
    return newAgentPrivate.save();
  }

  getAgentPrivateByEmail(email) {
    return AgentPrivateModel.findOne({ email }).populate([
      {
        path: "givenRatings",
        populate: { path: "user" },
      },
      {
        path: "bookings",
        populate: [
          {
            path: "request",
            populate: { path: "user" },
          },
          {
            path: "service",
            populate: [
              { path: "category" },
              {
                path: "ratings",
                populate: { path: "user" },
              },
            ],
          }
        ],
      }
    ]).exec();
  }
}

module.exports = AgentPrivateService;
