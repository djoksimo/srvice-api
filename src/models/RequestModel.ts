import Mongoose from "mongoose";
import { createModel } from "./createModel";

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const requestSchema = new Schema(
  {
    _id: { type: ObjectId, auto: true, required: true },
    user: { type: ObjectId, ref: "User", required: true },
    description: { type: String, required: false },
    pictureUrls: { type: [String], required: true },
    bookings: { type: [{ type: ObjectId, ref: "Booking" }], required: true },
    booked: { type: Boolean, required: true },
  },
  { versionKey: false, timestamps: true },
);

const requestModel = createModel("Request", requestSchema);

export default requestModel;
