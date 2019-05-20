const { UserPrivateModel } = require("../models");

class UserPrivateService {

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
    this.servicePopulate = [
      this.agentPath,
      this.categoryPath,
      this.ratingsPath,
    ];
    this.bookingsPath = {
      path: "bookings",
      populate: [
        this.agentPath,
        {
          path: "service",
          populate: this.servicePopulate,
        },
      ],
    };
  }

  createUserPrivate(newUserPrivate) {
    return newUserPrivate.save();
  }

  getUserPrivateByEmail(email) {
    return UserPrivateModel.findOne({ email }).populate([
      {
        path: "savedServices",
        populate: this.servicePopulate,
      },
      {
        path: "givenRatings",
        populate: {
          path: "service",
          populate: this.servicePopulate,
        },
      },
      {
        path: "requests",
        populate: this.bookingsPath,
      },
      this.bookingsPath,
    ]).exec();
  }

  addRequestToUserPrivate(email, requestId) {
    return UserPrivateModel.findOneAndUpdate({ email }, { $push: { requests: requestId } });
  }

  addBookingToUserPrivate(email, bookingId) {
    return UserPrivateModel.findOneAndUpdate({ email }, { $push: { bookings: bookingId } });
  }
}

module.exports = UserPrivateService;
