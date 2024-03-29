import Mongoose from "mongoose";
import { createModel } from "./createModel";

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const serviceSchema = new Schema(
  {
    agent: { type: ObjectId, ref: "Agent", required: true },
    category: { type: ObjectId, ref: "Category", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    pictureUrls: { type: [String], required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    inCall: { type: Boolean, required: true },
    outCall: { type: Boolean, required: true },
    remoteCall: { type: Boolean, required: true },
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    radius: { type: Number, required: true },
    averageServiceRating: { type: Number, required: true },
    serviceRatings: { type: [{ type: ObjectId, ref: "ServiceRating" }], required: true },
    offerings: { type: [{ type: ObjectId, ref: "Offering" }], required: false },
    viewCount: { type: Number, required: true, default: 0 },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  { versionKey: false, timestamps: true },
);

const serviceModel = createModel("Service", serviceSchema);

export default serviceModel;
