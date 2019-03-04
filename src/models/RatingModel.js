const Mongoose = require("mongoose");

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const ratingSchema = Schema({
  _id: { type: ObjectId, required: true, auto: true },
  forEmail: { type: String, required: true },
  byEmail: { type: String, required: true },
  date: { type: Date, required: true },
  rating: { type: Number, required: true },
  text: { type: String, required: false },
});

module.exports = Mongoose.model("Rating", ratingSchema);
