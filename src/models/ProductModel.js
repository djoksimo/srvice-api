const Mongoose = require("mongoose");

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const productSchema = Schema({
  _id: { type: ObjectId, auto: true, required: true },
  title: { type: String, required: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: false },
}, { versionKey: false });

const productModel = Mongoose.model("Product", productSchema);

module.exports = productModel;
