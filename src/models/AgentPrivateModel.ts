import Mongoose from "mongoose";
import { createModel } from "./createModel";

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const agentPrivateSchema = new Schema(
  {
    _id: { type: ObjectId, auto: true, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    governmentIdUrl: { type: String, required: false },
    secondaryIdUrl: { type: String, required: false },
    selfieUrl: { type: String, required: false },
    givenRatings: { type: [{ type: ObjectId, ref: "UserRating" }], required: true },
    bookings: { type: [{ type: ObjectId, ref: "Booking" }], required: true },
  },
  { versionKey: false },
);

const agentModel = createModel("AgentPrivate", agentPrivateSchema);

export default agentModel;
