export const chatSocketId = {
  SUBSCRIBE_ROOMS_MESSAGES: 'chat-socket-subscribe-rooms-messages',
  SUBSCRIBE_NOTIFY_USER: 'chat-socket-subscribe-stream-notify-user',
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
  REMOVE_MESSAGE: 'rm',
};

export const messageStatus = {
  SENDING: 'sending',
  SENT: 'sent',
  RECEIVED: 'received',
  FAILED: 'failed',
};

export const chatPermissions = {
  CAN_PIN_MESSAGE: 'can_pin_message',
  CAN_MUTE: 'can_mute',
  CAN_LEAVE: 'can_leave',
  CAN_MANAGE_MEMBER: 'can_manage_member',
};

export const messageOptionData = {
  pin: {
    icon: 'iconPinGroup',
    label: 'pin_message',
  },
  edit: {
    icon: 'EditAlt',
    label: 'edit_message',
  },
  create_thread: {
    icon: 'CreateThread',
    label: 'create_thread',
  },
  delete: {
    icon: 'Trash',
    label: 'delete',
  },
  reply: {
    icon: 'iconReply',
    label: 'reply',
  },
  copy: {
    icon: 'Copy',
    label: 'copy',
  },
  get_link: {
    icon: 'Link',
    label: 'get_link',
  },
  reactions: {
    icon: 'Smile',
    label: 'reactions',
  },
};

export type MessageOptionType = keyof typeof messageOptionData;

export const myMessageOptions = [
  'reply',
  'create_thread',
  'copy',
  'get_link',
  'edit',
  'delete',
];

export const messageOptions = ['copy', 'reply', 'get_link'];

export const reactions = {
  heart_eyes: {
    id: 'heart_eyes',
    icon: 'heart_eyes',
  },
  open_mouth: {
    id: 'open_mouth',
    icon: 'open_mouth',
  },
  rolling_on_the_floor_laughing: {
    id: 'rolling_on_the_floor_laughing',
    icon: 'rolling_on_the_floor_laughing',
  },
  sob: {
    id: 'sob',
    icon: 'sob',
  },
  rage: {
    id: 'rage',
    icon: 'rage',
  },
  add_react: {
    id: 'add_react',
    icon: 'iconReact',
  },
};
