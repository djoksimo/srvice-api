class ChatManager {
  constructor(chatService) {
    this.chatService = chatService;
  }

  async createChatUser({ userId, firstName, lastName, profilePictureUrl }) {
    try {
      const userResult = await this.chatService.createPusherUser(userId, firstName, lastName, profilePictureUrl);
      return { status: 201, json: userResult };
    } catch (error) {
      return { status: error.status, json: error };
    }
  }

  async startConversation({ senderId, recipientId, recipientFirstName, senderFirstName }) {
    try {
      const creationResult = await this.chatService.createPusherPrivateRoom(
        senderId,
        recipientId,
        recipientFirstName,
        senderFirstName,
      );
      return { status: 201, json: creationResult };
    } catch (error) {
      return { status: error.status, json: error };
    }
  }

  async updateUser({ id, ...data }) {
    try {
      const updateResult = await this.chatService.updatePusherUser(id, data);
      return { status: 200, json: updateResult };
    } catch (error) {
      return { status: error.status, json: error };
    }
  }

  async authenticateUser({ query }) {
    try {
      // eslint-disable-next-line camelcase
      const { user_id } = query;
      const authResult = await this.chatService.authenticatePusherUser(user_id);
      return { status: authResult.status, json: authResult.body };
    } catch (error) {
      return { status: error.status, json: error };
    }
  }
}

module.exports = ChatManager;
