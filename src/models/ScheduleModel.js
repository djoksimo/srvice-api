const Mongoose = require("mongoose");

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const scheduleModel = Schema({
  _id: { type: ObjectId, auto: true, required: true },
  availability: {
    type: [{
      start: { type: Date, required: true },
      end: { type: Date, required: true },
    }],
    required: true,
  },
  bookings: [{
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    product: { type: ObjectId, ref: "Product", required: true },
    user: { type: ObjectId, ref: "User", required: true },
  }],
}, { versionKey: false });

const productModel = Mongoose.model("Schedule", scheduleModel);

module.exports = productModel;