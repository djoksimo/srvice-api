const Mongoose = require("mongoose");

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const userRatingSchema = Schema({
  _id: { type: ObjectId, auto: true, required: true },
  agent: { type: ObjectId, ref: "Agent", required: true },
  user: { type: ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  date: { type: Date, required: true },
}, { versionKey: false });

const userRatingModel = Mongoose.model("UserRating", userRatingSchema);

module.exports = userRatingModel;
