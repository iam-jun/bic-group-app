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
};

export const messageStatus = {
  SENDING: 'sending',
  SENT: 'sent',
  RECEIVED: 'received',
  FAILED: 'failed',
};
