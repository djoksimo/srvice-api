import Chatkit from "@pusher/chatkit-server";

import { PusherValues } from "../values";
import { UuidUtils } from "../utilities";

export default class ChatService {
  chatkit: Chatkit;

  constructor() {
    // eslint-disable-next-line new-cap
    this.chatkit = new Chatkit({
      instanceLocator: PusherValues.CHATKIT_INSTANCE_LOCATOR,
      key: PusherValues.CHATKIT_SECRET_KEY,
    });
  }

  createPusherUser(srviceUserId: any, firstName: any, lastName: any, profilePictureUrl: any) {
    return this.chatkit.createUser({
      id: srviceUserId,
      name: `${firstName} ${lastName}`,
      avatarURL: profilePictureUrl,
    });
  }

  createPusherPrivateRoom(senderId: string, recipientId: string, recipientFirstName: any, senderFirstName: any) {
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
