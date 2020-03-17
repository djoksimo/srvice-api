import Mongoose from "mongoose";
import { createModel } from "./createModel";

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const bookingSchema = new Schema(
  {
    _id: { type: ObjectId, auto: true, required: true },
    request: { type: ObjectId, ref: "Request", required: true },
    agent: { type: ObjectId, ref: "Agent", required: true },
    service: { type: ObjectId, ref: "Service", required: true },
    priceEstimate: { type: Number, required: true },
    timeEstimate: { type: Number, required: true },
    agentAccepted: { type: Boolean, required: true },
    userAccepted: { type: Boolean, required: true },
  },
  { versionKey: false },
);

const bookingModel = createModel("Booking", bookingSchema);

export default bookingModel;
