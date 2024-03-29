import Mongoose from "mongoose";
import { createModel } from "./createModel";

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const userSchema = new Schema(
  {
    _id: { type: ObjectId, auto: true, required: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateJoined: { type: Date, required: true },
    profilePictureUrl: { type: String, required: false },
  },
  { versionKey: false },
);

const userModel = createModel("User", userSchema);

export default userModel;
