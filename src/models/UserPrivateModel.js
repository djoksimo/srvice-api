const Mongoose = require("mongoose");

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const userPrivateSchema = Schema({
  _id: { type: ObjectId, auto: true, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  savedServices: { type: [{ type: ObjectId, ref: "Service" }], required: true },
  givenRatings: { type: [{ type: ObjectId, ref: "ServiceRating"}], required: true },
  requests: { type: [{ type: ObjectId, ref: "Request" }], required: true },
  bookings: { type: [{ type: ObjectId, ref: "Booking" }], required: true },
});

const userPrivateModel = Mongoose.model("UserPrivate", userPrivateSchema);

module.exports = userPrivateModel;
