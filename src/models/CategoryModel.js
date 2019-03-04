const Mongoose = require("mongoose");

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const categorySchema = Schema({
  _id: { type: ObjectId, required: true },
  name: { type: "String", required: true },
  services: { type: [{ type: ObjectId, ref: "Service" }], required: true },
});

const categoryModel = Mongoose.model("Category", categorySchema);

module.exports = categoryModel;
