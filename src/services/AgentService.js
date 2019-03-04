const { AgentModel } = require("../models");

class AgentService {
  createAgent(newAgent) {
    return newAgent.save();
  }

  getAgentByEmail(email) {
    return AgentModel.findOne({ email }).populate({
      path: "services",
      populate: [
        {
          path: "category",
          select: "_id name",
        },
        {
          path: "ratings",
          populate: { path: "user" },
        },
      ],
    }).exec();
  }

  getAgentById(id) {
    return AgentModel.findById(id).populate({
      path: "services",
      populate: [
        {
          path: "category",
          select: "_id name",
        },
        {
          path: "ratings",
          populate: { path: "user" },
        },
      ],
    }).exec();
  }

  addServiceToAgent(agentId, serviceId) {
    return AgentModel.findByIdAndUpdate(agentId, { $push : { services: serviceId }});
  }
}

module.exports = AgentService;