import Mongoose from "mongoose";
import { createModel } from "./createModel";

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const offeringSchema = new Schema(
  {
    _id: { type: ObjectId, auto: true, required: true },
    title: { type: String, required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: false },
    agent: { type: ObjectId, ref: "Agent", required: true },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  { versionKey: false },
);

const offeringModel = createModel("Offering", offeringSchema);

export default offeringModel;
