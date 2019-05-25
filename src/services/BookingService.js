const { BookingModel } = require("../models");

class BookingService {

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

  updatePriceEstimateAgentAcceptedById(_id, priceEstimate, agentAccepted) {
    return BookingModel.update({ _id }, { $set: { priceEstimate, agentAccepted } });
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
