import Mongoose, { model } from "mongoose";

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const getDefaultInputFieldTitle = (field) => `Descriptive and short ${field}`;

const categorySchema = Schema(
  {
    _id: { type: ObjectId, auto: true, required: true },
    placeholderInputServiceTitle: {
      type: "String",
      default: getDefaultInputFieldTitle("service title"),
      required: true,
    },
    placeholderInputServiceDescription: {
      type: "String",
      default: getDefaultInputFieldTitle("service description"),
      required: true,
    },
    name: { type: "String", required: true },
    iconUrl: { type: "String", required: true },
  },
  { versionKey: false },
);

const categoryModel = model("Category", categorySchema);

export default categoryModel;
