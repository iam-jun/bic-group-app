// flow
import Actions from './constants';

export default {
  initChat: () => ({
    type: Actions.INIT_CHAT,
  }),
  setUnreadChannels: (payload: any) => ({
    type: Actions.SET_UNREAD_CHANNELS,
    payload,
  }),
  handleChatEvent: (payload: any) => ({
    type: Actions.HANDLE_CHAT_EVENT,
    payload,
  }),
  updateChannelNotificationCount: (payload: any) => ({
    type: Actions.UPDATE_CHANNEL_NOTIFICATION_COUNT,
    payload,
  }),
};
