const Mongoose = require("mongoose");

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const offeringSchema = Schema({
  _id: { type: ObjectId, auto: true, required: true },
  title: { type: String, required: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: false },
  agent: { type: ObjectId, ref: "Agent", required: true },
}, { versionKey: false });

const offeringModel = Mongoose.model("Offering", offeringSchema);

module.exports = offeringModel;
