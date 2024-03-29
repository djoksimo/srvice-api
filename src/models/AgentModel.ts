import Mongoose from "mongoose";
import { createModel } from "./createModel";

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const agentSchema = new Schema(
  {
    _id: { type: ObjectId, auto: true, required: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateJoined: { type: Date, required: true },
    profilePictureUrl: { type: String, required: false },
    services: { type: [{ type: ObjectId, ref: "Service" }], required: true },
    location: { type: String, required: false },
    languages: { type: [String], required: true },
    company: { type: String, required: false },
    education: { type: [String], required: true },
    certifications: { type: [String], required: true },
    skills: { type: [String], required: true },
    schedule: { type: ObjectId, ref: "Schedule", required: false },
  },
  { versionKey: false },
);

const agentModel = createModel("Agent", agentSchema);

export default agentModel;
