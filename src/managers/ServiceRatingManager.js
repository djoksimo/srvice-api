const { ServiceRatingModel } = require("../models/");
const { CalculationUtils } = require("../utils");

class ServiceRatingManager {

  constructor(ServiceRatingService, ServiceService) {
    this.serviceRatingService = ServiceRatingService;
    this.serviceService = ServiceService;
  }

  async createServiceRating({ userId: user, serviceId: service, overallRating, priceRating, punctualityRating, friendlinessRating, comment, date }) {
    const newServiceRating = new ServiceRatingModel({ user, service, overallRating, priceRating, punctualityRating, friendlinessRating, comment, date });
    try {
      const serviceRatingDocument = await this.serviceRatingService.saveServiceRating(newServiceRating);
      await this.serviceService.addServiceRatingToService(service, serviceRatingDocument.toObject()._id);
      const serviceDocument = await this.serviceService.findServiceById(service);

      const { serviceRatings } = serviceDocument;
      const overallRatings = serviceRatings.map(rating => rating.overallRating);
      serviceDocument.averageServiceRating = CalculationUtils.average(overallRatings, 0);

      await this.serviceService.updateService(serviceDocument);

      return { status: 201, json: {} };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async patchServiceRating(serviceRating) {
    try {
      const result = await this.serviceService.updateServiceRating(serviceRating);
      return { status: 200, json: result };
    } catch (error) {
      return { status: 500, json: error };
    }
  }
}

module.exports = ServiceRatingManager;
