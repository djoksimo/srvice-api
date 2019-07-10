const { ServiceRatingModel } = require("../models");

class ServiceRatingService {
  saveServiceRating(serviceRating) {
    return serviceRating.save();
  }

  updateServiceRating(serviceRating) {
    return ServiceRatingModel.update({ _id: serviceRating._id }, { $set: serviceRating }).exec();
  }
}

module.exports = ServiceRatingService;
