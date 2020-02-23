const Mongoose = require("mongoose");

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const userSchema = Schema(
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

const userModel = Mongoose.model("User", userSchema);

module.exports = userModel;
