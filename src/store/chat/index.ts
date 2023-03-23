import chatSocketEvents from '~/constants/chatSocketEvents';
import {
  resetStore,
  createStore,
} from '../utils';
import { handleChannelViewedEvent, handlePostedEvent, handlePostUnreadEvent } from './utils';
import chatApi from '~/api/ChatApi';
import IChatState from '~/store/chat/IChatState';
import { convertArrayToObject } from '~/utils/formatter';

const initialState = {
  unreadChannels: {},
};

const chatStore = (set, get) => ({
  ...initialState,
  initChat: async () => {
    try {
      const response = await chatApi.init();
      const data = response?.data;
      const result = convertArrayToObject(data, 'channelId');

      set({ unreadChannels: result }, 'initChat');
    } catch (error) {
      console.error('initChat', error);
    }
  },
  handleChatEvent: (userId: string, payload: any) => {
    let channel = null;
    const { unreadChannels } = get();
    switch (payload.event) {
      case chatSocketEvents.POSTED:
        channel = handlePostedEvent(payload, unreadChannels, userId);
        break;
      case chatSocketEvents.CHANNEL_VIEWED:
        channel = handleChannelViewedEvent(payload);
        break;
      case chatSocketEvents.POST_UNREAD:
        channel = handlePostUnreadEvent(payload);
        break;
      default:
        break;
    }
    if (channel?.id) {
      set((state) => {
        state.unreadChannels[channel.id] = channel;
      });
    }
  },
  reset: () => resetStore(initialState, set),
});

const useChatStore = createStore<IChatState>(chatStore);

export default useChatStore;
