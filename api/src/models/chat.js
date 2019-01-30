const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
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

module.exports = mongoose.model("Chat", chatSchema);

