const Mongoose = require("mongoose");

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const agentPrivateSchema = Schema({
  _id: { type: ObjectId, auto: true, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  governmentIdUrl: { type: String, required: true },
  secondaryIdUrl: { type: String, required: true },
  selfieUrl: { type: String, required: true },
  givenRatings: { type: [{ type: ObjectId, ref: "UserRating" }], required: true },
  bookings: { type: [{ type: ObjectId, ref: "Booking" }], required: true },
});

const agentModel = Mongoose.model("AgentPrivate", agentPrivateSchema);

module.exports = agentModel;
