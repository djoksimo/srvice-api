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
        const offeringDocument = service.toObject();
        const { agent } = offeringDocument;
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
    this.offeringsPath = { path: "offerings" };
    this.agentPath = {
      path: "agent",
      populate: [
        {
          path: "schedule",
          populate: [{ path: "offering" }, { path: "user" }],
        },
      ],
    };
    this.servicePopulate = [this.agentPath, this.categoryPath, this.ratingsPath, this.offeringsPath];
  }

  saveService(newService) {
    return newService.save();
  }

  findServicesByCategoryId(category) {
    return ServiceModel.find({ category })
      .populate(this.servicePopulate)
      .limit(500)
      .exec();
  }

  findSemiPopulatedAgentServiceById(id) {
    return ServiceModel.findById(id)
      .populate("agent")
      .exec();
  }

  findServiceById(id) {
    return ServiceModel.findById(id)
      .populate([
        {
          path: "serviceRatings",
        },
        {
          path: "agent",
          select: "firstName lastName averageServiceRating pictureUrls profilePictureUrl",
          populate: [
            {
              path: "services",
              select: "title averageServiceRating inCall outCall remoteCall",
            },
          ],
        },
      ])
      .exec();
  }

  updateViewCount(serviceId) {
    return ServiceModel.findByIdAndUpdate(serviceId, { $inc: { viewCount: 1 } }).exec();
  }

  async updateService(service, agentId) {
    const isOwner = await ServiceService.isOwner(service._id, agentId);
    if (!isOwner) {
      throw new Error("NICE TRY");
    }
    return ServiceModel.findByIdAndUpdate(service._id, service, { new: true }).exec();
  }

  async updateServiceWithoutOwnership(partialServiceDocument) {
    return ServiceModel.findByIdAndUpdate(partialServiceDocument._id, partialServiceDocument, { new: true }).exec();
  }

  async removeService(serviceId, agentId) {
    const isOwner = await ServiceService.isOwner(serviceId, agentId);
    if (!isOwner) {
      throw new Error("NICE TRY");
    }

    return ServiceModel.findByIdAndUpdate(serviceId, { isDeleted: true }, { new: true }).exec();
  }

  addServiceRatingToService(serviceId, serviceRatingId) {
    return ServiceModel.findByIdAndUpdate(serviceId, { $push: { serviceRatings: serviceRatingId }, new: true }).exec();
  }

  async addOfferingToService(serviceId, offeringId, agentId) {
    const isOwner = await ServiceService.isOwner(serviceId, agentId);
    if (!isOwner) {
      throw new Error("NICE TRY ;)");
    }
    return ServiceModel.updateOne({ _id: serviceId }, { $push: { offerings: offeringId } }).exec();
  }

  async removeOfferingFromService(serviceId, offeringId, agentId) {
    const isOwner = await ServiceService.isOwner(serviceId, agentId);
    if (!isOwner) {
      throw new Error("NICE TRY");
    }
    return ServiceModel.findByIdAndUpdate(serviceId, { $pull: { offerings: offeringId } }).exec();
  }
}

module.exports = ServiceService;
