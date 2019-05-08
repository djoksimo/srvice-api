const Service = require("../models/ServiceModel");
const { ServiceModel } = require("../models");

class ServiceService {

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
    this.servicePopulate = [
      this.agentPath,
      this.categoryPath,
      this.ratingsPath,
    ];
  }

  saveService(newService) {
    return newService.save();
  }

  findServicesByCategoryId(category) {
    return ServiceModel.find({ category }).populate(this.servicePopulate).exec();
  }

  findSemiPopulatedAgentServiceById(id) {
    return ServiceModel.findById(id).populate("agent").exec();
  }

  findServiceById(id) {
    return Service.findById(id).exec();
  }

  updateService(service) {
    return Service.update({ _id: service._id }, { $set: service }).exec();
  }

  removeService(id) {
    return Service.remove({ _id: id }).exec();
  }
}

module.exports = ServiceService;
