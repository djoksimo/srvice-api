import Chatkit from "@pusher/chatkit-server";

import { PusherValues } from "../values";
import { UuidUtils } from "../utils";

export default class ChatService {
  constructor() {
    // eslint-disable-next-line new-cap
    this.chatkit = new Chatkit({
      instanceLocator: PusherValues.CHATKIT_INSTANCE_LOCATOR,
      key: PusherValues.CHATKIT_SECRET_KEY,
    });
  }

  createPusherUser(srviceUserId, firstName, lastName, profilePictureUrl) {
    return this.chatkit.createUser({
      id: srviceUserId,
      name: `${firstName} ${lastName}`,
      avatarURL: profilePictureUrl,
    });
  }

  createPusherPrivateRoom(senderId, recipientId, recipientFirstName, senderFirstName) {
    return this.chatkit.createRoom({
      id: UuidUtils.generateUUID(),
      creatorId: senderId,
      userIds: [senderId, recipientId],
      name: `${recipientFirstName} and ${senderFirstName}`,
      isPrivate: true,
    });
  }

  authenticatePusherUser(pusherUserId) {
    return this.chatkit.authenticate({
      userId: pusherUserId,
    });
  }

  updatePusherUser(pusherUserId, data) {
    return this.chatkit.updateUser({
      id: pusherUserId,
      ...data,
    });
  }
}
