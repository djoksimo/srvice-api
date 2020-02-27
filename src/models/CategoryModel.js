const Mongoose = require("mongoose");

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const categorySchema = Schema(
  {
    _id: { type: ObjectId, auto: true, required: true },
    placeholderInputServiceTitle: { type: "String", default: "Descriptive and short service title", required: true },
    placeholderInputServiceDescription: {
      type: "String",
      default: "Descriptive and short service description",
      required: true,
    },
    name: { type: "String", required: true },
    iconUrl: { type: "String", required: true },
  },
  { versionKey: false },
);

const categoryModel = Mongoose.model("Category", categorySchema);

module.exports = categoryModel;
