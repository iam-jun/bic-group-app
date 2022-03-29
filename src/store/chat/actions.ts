// flow
import Actions from './constants';

export default {
  initChat: () => {
    return {
      type: Actions.INIT_CHAT,
    };
  },
  setUnreadChannels: (payload: any) => {
    return {
      type: Actions.SET_UNREAD_CHANNELS,
      payload,
    };
  },
  handleChatEvent: (payload: any) => {
    return {
      type: Actions.HANDLE_CHAT_EVENT,
      payload,
    };
  },
  updateChannelNotificationCount: (payload: any) => {
    return {
      type: Actions.UPDATE_CHANNEL_NOTIFICATION_COUNT,
      payload,
    };
  },
};
