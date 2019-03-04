const Mongoose = require("mongoose");

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const categorySchema = Schema({
  name: { type: "String", required: true },
  services: { type: [{ type: ObjectId, ref: "Service" }], required: true },
}, { versionKey: false });

const categoryModel = Mongoose.model("Category", categorySchema);

module.exports = categoryModel;
