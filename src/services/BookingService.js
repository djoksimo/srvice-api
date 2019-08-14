const { BookingModel } = require("../models");

class BookingService {
  static isOwner(bookingId, agentId) {
    return new Promise((resolve, reject) => {
      BookingModel.findById(bookingId, (err, booking) => {
        if (err) {
          return reject(err);
        }
        if (!booking) {
          return reject(new Error("Could not find booking"));
        }
        if (agentId.toString() !== booking.toObject().agent.toString()) {
          resolve(false);
        }
        return resolve(true);
      });
    });
  }

  constructor() {
    this.categoryPath = { path: "category", select: "_id name iconUrl" };
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
        ],
      },
    };
    this.servicePath = {
      path: "service",
      populate: [
        this.categoryPath,
        this.ratingsPath,
      ],
    };
  }

  createBooking(newBooking) {
    return newBooking.save();
  }

  async updatePriceEstimateAgentAcceptedById(bookingId, priceEstimate, timeEstimate, agentAccepted, agentId) {
    const isOwner = await BookingService.isOwner(bookingId, agentId);
    if (!isOwner) {
      throw new Error("NICE TRY");
    }
    return BookingModel.update({ _id }, { $set: { priceEstimate, timeEstimate, agentAccepted } });
  }

  updateUserAcceptedById(_id, userAccepted) {
    return BookingModel.update({ _id }, { $set: { userAccepted } });
  }

  getBookingById(id) {
    return BookingModel.findById(id).populate([
      this.agentPath,
      this.servicePath,
    ]).exec();
  }
}

module.exports = BookingService;
