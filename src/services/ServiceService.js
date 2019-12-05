const { ServiceModel } = require("../models");

class ServiceService {

  static isOwner(serviceId, agentId) {
    return new Promise((resolve, reject) => {
      ServiceModel.findById(serviceId, (err, service) => {
        if (err) {
          return reject(err);
        }
        if (!service) {
          return reject(Error("Could not find service"));
        }
        const productDocument = service.toObject();
        const { agent } = productDocument;
        console.log(agentId);
        console.log(agent.toString());
        if (agentId !== agent.toString()) {
          return resolve(false);
        }
        return resolve(true); 
      });
    });
  }

  constructor() {
    this.categoryPath = { path: "category", select: "_id name iconUrl" };
    this.ratingsPath = {
      path: "serviceRatings",
      populate: { path: "user" },
    };
    this.productsPath = { path: "products" };
    this.agentPath = {
      path: "agent",
      populate: [
        {  
          path: "schedule",
          populate: [
            { path: "product" },
            { path: "user" },
          ],
        },
      ],
    };
    this.servicePopulate = [
      this.agentPath,
      this.categoryPath,
      this.ratingsPath,
      this.productsPath,
    ];
  }

  saveService(newService) {
    return newService.save();
  }

  findServicesByCategoryId(category) {
    return ServiceModel.find({ category }).populate(this.servicePopulate).limit(30).exec();
  }

  findSemiPopulatedAgentServiceById(id) {
    return ServiceModel.findById(id).populate("agent").exec();
  }

  findServiceById(id) {
    return ServiceModel.findById(id).populate("serviceRatings").exec();
  }

  async updateService(service, agentId) {
    const isOwner = await ServiceService.isOwner(service._id, agentId);
    if (!isOwner) {
      throw new Error("NICE TRY");
    }
    return ServiceModel.updateOne({ _id: service._id }, { $set: service }).exec();
  }

  async removeService(serviceId, agentId) {
    const isOwner = await ServiceService.isOwner(serviceId, agentId); 
    if (!isOwner) {
      throw new Error("NICE TRY");
    }
    return ServiceModel.deleteOne({ _id: serviceId }).exec();
  }

  addServiceRatingToService(serviceId, serviceRatingId) {
    return ServiceModel.findByIdAndUpdate(serviceId, { $push: { serviceRatings: serviceRatingId } }).exec();
  }

  async addProductToService(serviceId, productId, agentId) {
    const isOwner = await ServiceService.isOwner(serviceId, agentId);
    if (!isOwner) {
      throw new Error("NICE TRY ;)");
    }
    return ServiceModel.updateOne({ _id: serviceId }, { $push: { products: productId } }).exec();
  }

  async removeProductFromService(serviceId, productId, agentId) {
    const isOwner = await ServiceService.isOwner(serviceId, agentId);
    console.log(isOwner);
    if (!isOwner) {
      throw new Error("NICE TRY");
    }
    return ServiceModel.findByIdAndUpdate(serviceId, { $pull: { products: productId } }).exec();
  }
}

module.exports = ServiceService;
