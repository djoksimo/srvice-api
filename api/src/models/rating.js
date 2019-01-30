const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
  forEmail: { type: String, required: true },
  byEmail: { type: String, required: true },
  date: { type: Date, required: true },
  rating: { type: Number, required: true },
  text: { type: String, required: false },
});

module.exports = mongoose.model("Rating", ratingSchema);
