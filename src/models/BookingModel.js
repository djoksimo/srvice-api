const Mongoose = require("mongoose");

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const bookingSchema = Schema({
  _id: { type: ObjectId, auto: true, required: true },
  request: { type: ObjectId, ref: "Request", required: true },
  agent: { type: ObjectId, ref: "Agent", required: true },
  service: { type: ObjectId, ref: "Service", required: true },
  priceEstimate: { type: Number, required: true },
  timeEstimate: { type: Number, required: true },
  agentAccepted: { type: Boolean, required: true },
  userAccepted: { type: Boolean, required: true },
}, { versionKey: false });

const bookingModel = Mongoose.model("Booking", bookingSchema);

module.exports = bookingModel;
