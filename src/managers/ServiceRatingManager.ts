import { ObjectID } from "mongodb";

import { ServiceRating, AuthHeaders } from "../types";
import { ServiceRatingModel } from "../models";
import { CalculationUtils } from "../utilities";
import { ServiceRatingService, ServiceService } from "../services";

interface NewServiceRating {
  userId: ObjectID;
  serviceId: ObjectID;
  overallRating: ServiceRating["overallRating"];
  priceRating: ServiceRating["priceRating"];
  punctualityRating: ServiceRating["punctualityRating"];
  friendlinessRating: ServiceRating["friendlinessRating"];
  comment: ServiceRating["comment"];
  date: ServiceRating["date"];
}

export default class ServiceRatingManager {
  serviceRatingService: ServiceRatingService;

  serviceService: ServiceService;

  constructor(serviceRatingService: ServiceRatingService, serviceService: ServiceService) {
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
  }: NewServiceRating) {
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
      const serviceDocument: any = await this.serviceService.findServiceById(service);

      const { serviceRatings } = serviceDocument;
      const overallRatings = serviceRatings.map((rating: ServiceRating) => rating.overallRating);
      serviceDocument.averageServiceRating = CalculationUtils.average(overallRatings, 0);

      await this.serviceService.updateServiceWithoutOwnership(serviceDocument);
      return { status: 201, json: { message: "Added rating successfully" } };
    } catch (error) {
      console.log(error);
      return { status: 500, json: error.toString() };
    }
  }

  async patchServiceRating(newPartialServiceRatingData: Partial<ServiceRating>, authHeaders: AuthHeaders) {
    try {
      const result = await this.serviceRatingService.updateServiceRating(
        newPartialServiceRatingData,
        authHeaders.userId,
      );
      return { status: 200, json: result };
    } catch (error) {
      return { status: 500, json: { error: error.toString() } };
    }
  }
}
