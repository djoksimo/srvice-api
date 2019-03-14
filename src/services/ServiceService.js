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

  createService(newService) {
    return newService.save();
  }

  getServicesByCategoryId(category) {
    return ServiceModel.find({ category }).populate(this.servicePopulate).exec();
  }

  getSemiPopulatedAgentServiceById(id) {
    return ServiceModel.findById(id).populate("agent").exec();
  }

  async create(data) {
    return data.save();
  }

  async find(id) {
    return Service.findById(id).populate('ratings').exec();
  }

  async findByName(name) {
    return Service.find({ title: { $regex: [name], $options: 'i' } }).populate('ratings').exec();
  }

  async findByHomeScreenGroup(group) {
    return Service.find({ homeScreenGroups: group }).populate('ratings').exec();
  }

  async findByCategoryId(id) {
    return Service.find({ categoryId: id }).populate('ratings').exec();
  }

  async get() {
    return Service.find().populate('ratings').exec();
  }

  async getTwenty() {
    return Service.find().limit(20).populate('ratings').exec();
  }

  async update(id, data) {
    return Service.update({_id: id}, {$set: data}).exec();
  }

  async remove(id) {
    return Service.remove({_id: id}).exec();
  }
}

module.exports = ServiceService;
