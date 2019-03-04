const Mongoose = require("mongoose");

const { Schema } = Mongoose;
const { ObjectId } = Schema.Types;

const chatSchema = Schema(
  {
    _id: { type: ObjectId, required: true, auto: true },
    participants: [{type: String, required: true }],
    messages: {
      type: [{
        content: {
          type: String,
          required: true,
        },
        fromUser: {
          type: String,
          required: true,
        },
        isSeen: {
          type: Boolean,
          required: true,
        },
        timeStamp : { type : Date, default: Date.now }
      }],
      required: true,
    },
  },
);

module.exports = Mongoose.model("Chat", chatSchema);

