const Mongoose = require("mongoose");

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const agentSchema = Schema({
  _id: { type: ObjectId, auto: true, required: true },
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateJoined: { type: Date, required: true },
  profilePictureUrl: { type: String, required: false },
  services: { type: [{ type: ObjectId, ref: "Service" }], required: true },
  location: { type: String, required: false },
  languages: { type: [String], required: true },
  company: { type: String, required: false },
  education: { type: [String], required: true },
  certifications: { type: [String], required: true },
}, { versionKey: false });

const agentModel = Mongoose.model("Agent", agentSchema);

module.exports = agentModel;
