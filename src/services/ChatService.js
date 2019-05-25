const Chat = require("../models/ChatModel");

class ChatService {
  async create(data) {
    return data.save();
  }

  async findByEmail(email) {
    return Chat.find({ participants: email }).exec();
  }

  async findPairChats(byEmail, toEmail) {
    return Chat.find({ participants: { $all: [byEmail, toEmail] } }).exec();
  }

  async update(id, data) {
    return Chat.update({ _id: id }, { $set: data }).exec();
  }
}

module.exports = ChatService;
