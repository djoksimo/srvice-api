const { AgentModel } = require("../models");

class AgentService {
  createAgent(newAgent) {
    return newAgent.save();
  }

  getAgentByEmail(email) {
    return AgentModel.findOne({ email }).populate({
      path: "services",
      populate: [
        { path: "category", select: "_id name iconUrl" },
        {
          path: "serviceRatings",
          populate: { path: "user" },
        },
      ],
    }).exec();
  }

  getAgentById(id) {
    return AgentModel.findById(id).populate([
      {
        path: "services",
        populate: [
          { path: "category", select: "_id name iconUrl" },
          {
            path: "serviceRatings",
            populate: { path: "user" },
          },
          { path: "products" },
        ],
      },
      { path: "schedule" },
    ]).exec();
  }

  getNonPopulatedAgentById(id) {
    return AgentModel.findById(id).exec();
  }

  addServiceToAgent(agentId, serviceId) {
    return AgentModel.findByIdAndUpdate(agentId, { $push: { services: serviceId } }).exec();
  }

  updateAgent(agent) {
    return AgentModel.update({ _id: agent._id }, { $set: agent }).exec();
  }

  addScheduleToAgent(agentId, scheduleId) {
    return AgentModel.findByIdAndUpdate(agentId, { schedule: scheduleId }).exec();
  }
}

module.exports = AgentService;
