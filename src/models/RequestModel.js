const Mongoose = require("mongoose");

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const requestSchema = Schema({
  _id: { type: ObjectId, auto: true, required: true },
  user: { type: ObjectId, ref: "User", required: true },
  description: { type: String, required: false },
  pictureUrls: { type: [String], required: true },
  bookings: { type: [{ type: ObjectId, ref: "Booking" }], required: true },
  booked: { type: Boolean, required: true },
}, { versionKey: false });

const requestModel = Mongoose.model("Request", requestSchema);

module.exports = requestModel;
