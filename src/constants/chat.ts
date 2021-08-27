export const chatSocketId = {
  SUBSCRIBE_ROOMS_MESSAGES: 'chat-socket-subscribe-rooms-messages',
  ADD_MEMBERS_TO_GROUP: 'chat-socket-add-members-to-groups',
};

export const roomTypes = {
  QUICK: 'quick',
  GROUP: 'group',
  DIRECT: 'direct',
};

export const messageEventTypes = {
  ADD_USER: 'au',
  USER_JOINED: 'uj',
  ROOM_CHANGED_NAME: 'r',
  ROOM_CHANGED_DESCRIPTION: 'room_changed_description',
  ROOM_CHANGED_ANNOUNCEMENT: 'room_changed_announcement',
  ROOM_CHANGED_TOPIC: 'room_changed_topic',
  REMOVE_USER: 'ru',
};

export const messageStatus = {
  SENDING: 'sending',
  SENT: 'sent',
  RECEIVED: 'received',
  FAILED: 'failed',
};

export const chatPermissions = {
  CAN_PIN_MESSAGE: 'can_pin_message',
  CAN_INVITE: 'can_invite',
  CAN_MUTE: 'can_mute',
  CAN_REMOVE_CHAT_MEMBER: 'can_remove_chat_member',
  CAN_LEAVE: 'can_leave',
};
