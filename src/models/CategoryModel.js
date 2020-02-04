const Mongoose = require("mongoose");

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const categorySchema = Schema(
  {
    _id: { type: ObjectId, auto: true, required: true },
    name: { type: "String", required: true },
    iconUrl: { type: "String", required: true },
  },
  { versionKey: false },
);

const categoryModel = Mongoose.model("Category", categorySchema);

module.exports = categoryModel;
