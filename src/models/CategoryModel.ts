import Mongoose from "mongoose";
import { createModel } from "./createModel";

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const getDefaultInputFieldTitle = (field) => `Descriptive and short ${field}`;

const categorySchema = new Schema(
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

const categoryModel = createModel("Category", categorySchema);

export default categoryModel;
