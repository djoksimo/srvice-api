const mongoose = require("mongoose");

const serviceSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
  email: { type: String, required: true },
  title: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Category" },
  pictureUrls: { type: [String], required: true },
  description: { type: String, required: true },
  phone: { type: String, required: true },
  contactEmail: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  radius: { type: Number, required: true },
  homeScreenGroups: { type: [String], required: true },
  schedule: {
    type: {
      availability: {
        type: [{
          start: { type: Date, required: true },
          end: { type: Date, required: true },
        }],
        required: true,
      },
      bookings: {
        type: [{
          start: { type: Date, required: true },
          end: { type: Date, required: true },
        }],
        required: true,
      },
    },
    required: true,
  },
  products: {
    type: [{
      productTitle: { type: String, required: true },
      duration: { type: Number, required: true },
      cost: { type: Number, required: true },
      productDescription: { type: String, required: true },
    }],
    required: true,
  },
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],
});

module.exports = mongoose.model("Service", serviceSchema);
