import { ServiceRatingModel } from "../models";

export default class ServiceRatingService {
  static isOwner(serviceRatingId, userId) {
    return new Promise((resolve, reject) => {
      ServiceRatingModel.findById(serviceRatingId, (err, serviceRating) => {
        if (err) {
          return reject(err);
        }
        if (!serviceRating) {
          return reject(new Error("Could not find service rating"));
        }
        const serviceRatingDocument = serviceRating.toObject();
        const { user } = serviceRatingDocument;
        if (userId !== user.toString()) {
          return resolve(false);
        }
        return resolve(true);
      });
    });
  }

  saveServiceRating(serviceRating) {
    return serviceRating.save();
  }

  async updateServiceRatingWithoutAuth(partialServiceRating) {
    return ServiceRatingModel.updateOne({ _id: partialServiceRating._id }, { $set: partialServiceRating }).exec();
  }

  async updateServiceRating(partialServiceRating, userId) {
    const isOwner = await ServiceRatingService.isOwner(partialServiceRating._id, userId);
    if (!isOwner) {
      throw new Error("NICE TRY");
    }
    return ServiceRatingModel.updateOne({ _id: partialServiceRating._id }, { $set: partialServiceRating }).exec();
  }
}
