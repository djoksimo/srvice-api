import Mongoose, { model } from "mongoose";

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const serviceRatingSchema = Schema(
  {
    _id: { type: ObjectId, auto: true, required: true },
    user: { type: ObjectId, ref: "User", required: true },
    service: { type: ObjectId, ref: "Service", required: true },
    overallRating: { type: Number, required: true },
    priceRating: { type: Number, required: false },
    punctualityRating: { type: Number, required: false },
    friendlinessRating: { type: Number, required: false },
    comment: { type: String, required: true },
    date: { type: Date, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  { versionKey: false },
);

const serviceRatingModel = model("ServiceRating", serviceRatingSchema);

export default serviceRatingModel;
