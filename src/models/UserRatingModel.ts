import Mongoose from "mongoose";
import { createModel } from "./createModel";

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const userRatingSchema = new Schema(
  {
    _id: { type: ObjectId, auto: true, required: true },
    agent: { type: ObjectId, ref: "Agent", required: true },
    user: { type: ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { versionKey: false },
);

const userRatingModel = createModel("UserRating", userRatingSchema);

export default userRatingModel;
