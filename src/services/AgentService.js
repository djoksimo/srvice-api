const { AgentModel } = require("../models");

class AgentService {
  saveAgent(newAgent) {
    return newAgent.save();
  }

  findAgentByEmail(email) {
    return AgentModel.findOne({ email }).populate({
      path: "services",
      populate: [
        { path: "category", select: "_id name" },
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
        { path: "category", select: "_id name" },
        {
          path: "ratings",
          populate: { path: "user" },
        },
      ],
    }).exec();
  }

  getNonPopulatedAgentById(id) {
    return AgentModel.findById(id).exec();
  }

  addServiceToAgent(agentId, serviceId) {
    return AgentModel.findByIdAndUpdate(agentId, { $push : { services: serviceId }});
  }
}

module.exports = AgentService;
