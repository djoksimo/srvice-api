import Mongoose from "mongoose";
import { createModel } from "./createModel";

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const userPrivateSchema = new Schema(
  {
    _id: { type: ObjectId, auto: true, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    savedServices: { type: [{ type: ObjectId, ref: "Service" }], required: true },
    givenRatings: { type: [{ type: ObjectId, ref: "ServiceRating" }], required: true },
    requests: { type: [{ type: ObjectId, ref: "Request" }], required: true },
    bookings: { type: [{ type: ObjectId, ref: "Booking" }], required: true },
  },
  { versionKey: false },
);

const userPrivateModel = createModel("UserPrivate", userPrivateSchema);

export default userPrivateModel;
