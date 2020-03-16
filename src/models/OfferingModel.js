import Mongoose, { model } from "mongoose";

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const offeringSchema = Schema(
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

const offeringModel = model("Offering", offeringSchema);

export default offeringModel;
