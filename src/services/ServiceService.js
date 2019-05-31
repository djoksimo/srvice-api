const { ServiceModel } = require("../models");

class ServiceService {

  constructor() {
    this.categoryPath = { path: "category", select: "_id name iconUrl" };
    this.ratingsPath = {
      path: "serviceRatings",
      populate: { path: "user" },
    };
    this.agentPath = {
      path: "agent",
      populate: {
        path: "services",
        populate: [
          this.categoryPath,
          this.ratingsPath,
        ],
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
    return ServiceModel.findById(id).populate("serviceRatings").exec();
  }

  updateService(service) {
    return ServiceModel.update({ _id: service._id }, { $set: service }).exec();
  }

  removeService(id) {
    return ServiceModel.remove({ _id: id }).exec();
  }

  addServiceRatingToService(serviceId, serviceRatingId) {
    return ServiceModel.findByIdAndUpdate(serviceId, { $push: { serviceRatings: serviceRatingId } }).exec();
  }
}

module.exports = ServiceService;
