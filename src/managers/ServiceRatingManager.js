const { ServiceRatingModel } = require("../models/");
const { CalculationUtils } = require("../utils");

class ServiceRatingManager {
  constructor(serviceRatingService, serviceService) {
    this.serviceRatingService = serviceRatingService;
    this.serviceService = serviceService;
  }

  async createServiceRating({
    userId: user,
    serviceId: service,
    overallRating,
    priceRating,
    punctualityRating,
    friendlinessRating,
    comment,
    date,
    agentId,
  }) {
    const newServiceRating = new ServiceRatingModel({
      user,
      service,
      overallRating,
      priceRating,
      punctualityRating,
      friendlinessRating,
      comment,
      date,
    });
    try {
      const serviceRatingDocument = await this.serviceRatingService.saveServiceRating(newServiceRating);
      await this.serviceService.addServiceRatingToService(service, serviceRatingDocument.toObject()._id);
      const serviceDocument = await this.serviceService.findServiceById(service);

      const { serviceRatings } = serviceDocument;
      const overallRatings = serviceRatings.map((rating) => rating.overallRating);
      serviceDocument.averageServiceRating = CalculationUtils.average(overallRatings, 0);

      await this.serviceService.updateServiceWithoutOwnership(serviceDocument);
      return { status: 201, json: {} };
    } catch (error) {
      console.log(error);
      return { status: 500, json: error.toString() };
    }
  }

  async patchServiceRating(serviceRating, authHeaders) {
    try {
      const result = await this.serviceRatingService.updateServiceRating(serviceRating, authHeaders.userId);
      return { status: 200, json: result };
    } catch (error) {
      return { status: 500, json: { error: error.toString() } };
    }
  }
}

module.exports = ServiceRatingManager;
