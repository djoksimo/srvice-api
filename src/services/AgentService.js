const { AgentModel } = require("../models");

class AgentService {
  createAgent(newAgent) {
    return newAgent.save();
  }

  getAgentByEmail(email) {
    return AgentModel.findOne({ email }).populate({
      path: "services",
      populate: [
        { path: "category" },
        {
          path: "ratings",
          populate: { path: "user" },
        },
      ],
    }).exec();
  }
}

module.exports = AgentService;
