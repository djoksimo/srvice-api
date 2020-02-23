const { AgentModel } = require("../models");

class AgentService {
  createAgent(newAgent) {
    return newAgent.save();
  }

  getAgentByEmail(email) {
    return AgentModel.findOne({ email })
      .populate([
        {
          path: "services",
          populate: [
            { path: "category", select: "_id name iconUrl" },
            {
              path: "serviceRatings",
              populate: { path: "user" },
              options: {
                sort: { date: -1 },
              },
            },
            { path: "offerings" },
          ],
          options: {
            sort: { updatedAt: -1 },
          },
        },
        {
          path: "schedule",
          populate: [{ path: "bookings.offering" }, { path: "bookings.user" }],
        },
      ])
      .exec();
  }

  getAgentById(id) {
    return AgentModel.findById(id)
      .populate([
        {
          path: "services",
          populate: [
            { path: "category", select: "_id name iconUrl" },
            {
              path: "serviceRatings",
              populate: { path: "user" },
              options: {
                sort: { date: -1 },
              },
            },
            { path: "offerings" },
          ],
          options: {
            sort: { updatedAt: -1 },
          },
        },
        {
          path: "schedule",
          select: "-bookings.user -bookings.offering",
        },
      ])
      .exec();
  }

  getNonPopulatedAgentById(id) {
    return AgentModel.findById(id).exec();
  }

  addServiceToAgent(agentId, serviceId) {
    return AgentModel.findByIdAndUpdate(agentId, { $push: { services: serviceId } }).exec();
  }

  updateAgent(agent) {
    return AgentModel.updateOne({ _id: agent._id }, { $set: agent }).exec();
  }

  addScheduleToAgent(agentId, scheduleId) {
    return AgentModel.findByIdAndUpdate(agentId, { schedule: scheduleId }).exec();
  }
}

module.exports = AgentService;
