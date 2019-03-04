const Mongoose = require("mongoose");

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const agentSchema = Schema({
  _id: { type: ObjectId, auto: true, required: true },
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateJoined: { type: Date, required: true },
  profilePictureUrl: { type: Boolean, required: true },
  services: { type: [{ type: ObjectId, ref: "Service" }], required: true },
  location: { type: String, required: true },
  languages: { type: [String], required: true },
  company: { type: String, required: true },
  education: { type: [String], required: true },
  certifications: { type: [String], required: true },
});

const agentModel = Mongoose.model("Agent", agentSchema);

module.exports = agentModel;
