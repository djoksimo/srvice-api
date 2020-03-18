import { CreateUserOptions, CreateRoomOptions, UpdateUserOptions } from "@pusher/chatkit-server/target/src/chatkit";
import { ObjectID } from "mongodb";

import { ChatService } from "../services";

interface NewPusherUserPayload extends Partial<CreateUserOptions> {
  userId: ObjectID;
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
}

interface StartConversationPayload extends Partial<CreateRoomOptions> {
  senderId: string;
  recipientId: string;
  recipientFirstName: string;
  senderFirstName: string;
}

export default class ChatManager {
  chatService: ChatService;

  constructor(chatService: ChatService) {
    this.chatService = chatService;
  }

  async createChatUser({ userId, firstName, lastName, profilePictureUrl }: NewPusherUserPayload) {
    try {
      const userResult = await this.chatService.createPusherUser(userId, firstName, lastName, profilePictureUrl);
      return { status: 201, json: userResult };
    } catch (error) {
      return { status: error.status, json: error };
    }
  }

  async startConversation({ senderId, recipientId, recipientFirstName, senderFirstName }: StartConversationPayload) {
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

  async updateUser({ id, ...data }: UpdateUserOptions) {
    try {
      const updateResult = await this.chatService.updatePusherUser(id, data);
      return { status: 200, json: updateResult };
    } catch (error) {
      return { status: error.status, json: error };
    }
  }

  async authenticateUser({ query }: { query: { user_id: string } }) {
    try {
      // eslint-disable-next-line @typescript-eslint/camelcase
      const { user_id } = query;
      const authResult = this.chatService.authenticatePusherUser(user_id);
      return { status: authResult.status, json: authResult.body };
    } catch (error) {
      return { status: error.status, json: error };
    }
  }
}
