import Mongoose from "mongoose";
import { createModel } from "./createModel";

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const scheduleSchema = new Schema(
  {
    _id: { type: ObjectId, auto: true, required: true },
    availability: {
      type: [
        {
          weekday: { type: String, required: true },
          start: { type: Number, required: true },
          end: { type: Number, required: true },
        },
      ],
      required: true,
    },
    bookings: [
      {
        start: { type: Date, required: true },
        end: { type: Date, required: true },
        offering: { type: ObjectId, ref: "Offering", required: true },
        user: { type: ObjectId, ref: "User", required: true },
      },
    ],
    agent: { type: ObjectId, ref: "Agent", required: true },
  },
  { versionKey: false, timestamps: true },
);

const scheduleModel = createModel("Schedule", scheduleSchema);

export default scheduleModel;
