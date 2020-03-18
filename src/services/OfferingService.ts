import { OfferingModel } from "../models";

export default class OfferingService {
  static isOwner(offeringId, agentId) {
    return new Promise((resolve, reject) => {
      OfferingModel.findById(offeringId, (err, offering) => {
        if (err) {
          return reject(err);
        }
        if (!offering) {
          return reject(Error("Offering does not exist"));
        }
        const offeringDocument = offering.toObject();
        const { agent } = offeringDocument;
        if (agentId !== agent.toString()) {
          return resolve(false);
        }
        return resolve(true);
      });
    });
  }

  saveOffering(newOffering) {
    return newOffering.save();
  }

  async updateOffering(offering, agentId) {
    const isOwner = await OfferingService.isOwner(offering._id, agentId);
    if (!isOwner) {
      throw new Error("NICE TRY");
    }
    return OfferingModel.findByIdAndUpdate(offering._id, { $set: offering }).exec();
  }

  async removeOffering(offeringId, agentId) {
    const isOwner = await OfferingService.isOwner(offeringId, agentId);
    if (!isOwner) {
      throw new Error("NICE TRY");
    }
    return OfferingModel.deleteOne({ _id: offeringId }).exec();
  }
}
