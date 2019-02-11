const mongoose = require("mongoose");
const Chat = require("../models/chat");
const route = "/chat/";

class ChatManager {

  constructor(AuthManager, ChatService) {
    this._authManager = AuthManager;
    this._chatService = ChatService;
  }

  async create(data) {
    const { token, messages, participants } = data;

    const newMessage = new Chat({
      _id: new mongoose.Types.ObjectId(),
      participants,
      messages,
    });
    try {
      const verificationBody = await this._authManager.verifyToken(token);
      if (verificationBody.status === 403) {
        return { status: 403, json: verificationBody };
      }
      const result = await this._chatService.create(newMessage);
      return {
        status: 201,
        json: {
          message: "Chat added to database",
          request: {
            type: "POST",
            url: "http://" + "165.227.42.141:3000" + route,
          },
          result,
        },
      };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async update(data) {
    try {
      const verificationBody = await this._authManager.verifyToken(data.token);
      if (verificationBody.status === 403) {
        return { status: 403, json: verificationBody };
      }
      if (data.email !== verificationBody.json.json.result.email) {
        return {
          status: 403,
          json: {
            message: "Emails don't match, not authorized"
          }
        };
      }

      const result = await this._chatService.update(data._id, data);
      return {
        status: 200,
        json: {
          message: "Chat updated in database",
          request: {
            type: "PATCH",
            url: "http://" + "165.227.42.141:3000" + route,
          },
          result,
        },
      };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async findPairChats(data) {
    const { token, byEmail, toEmail } = data;
    try {
      const verificationBody = await this._authManager.verifyToken(token);
      if (verificationBody.status === 403) {
        return { status: 403, json: verificationBody };
      }
      const result = await this._chatService.findPairChats(byEmail, toEmail);
      if (result.length === 0) {
        return {
          status: 200,
          json: {
            isEmpty: true,
            message: "No chat pairs"
          }
        };
      }
      if (byEmail !== verificationBody.json.json.result.email &&
        toEmail !== verificationBody.json.json.result.email) {
        return { status: 403, json: verificationBody };
      }
      return {
        status: 200,
        json: {
          message: `Messages between ${byEmail} and ${toEmail}`,
          isEmpty: false,
          request: {
            type: "POST",
            url: `http://165.227.42.141:3000${route}pair`,
          },
          result
        },
      };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async findUserChats(data) {
    const { token, byEmail } = data;
    try {
      const verificationBody = await this._authManager.verifyToken(token);
      if (verificationBody.status === 403) {
        return { status: 403, json: verificationBody };
      }
      const result = await this._chatService.findByEmail(byEmail);
      if (result.length === 0) {
        return {
          status: 200,
          isEmpty: true,
          json: {
            isEmpty: true,
            message: "No chat pairs",
            verificationBody
          },
        };
      }
      if (verificationBody.status === 403) {
        return { status: 403, json: verificationBody };
      }
      if (byEmail !== verificationBody.json.json.result.email) return { status: 403, json: verificationBody };
      return {
        status: 200,
        json: {
          message: `Conversations with ${byEmail}`,
          isEmpty: false,
          request: {
            type: "POST",
            url: `http://165.227.42.141:3000${route}email`,
          },
          result,
        },
      };
    } catch (error) {
      return { status: 500, json: error };
    }
  }
}

module.exports = ChatManager;
