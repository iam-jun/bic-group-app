import { AxiosResponse } from 'axios';
import apiConfig from '~/configs/apiConfig';
import chatSocketEvents from '~/constants/chatSocketEvents';
import { makeHttpRequest } from '~/services/httpApiRequest';
import {
  createStore, withDevtools, withImmer, withPersist,
} from '../utils';
import { handleChannelViewedEvent, handlePostedEvent, handlePostUnreadEvent } from './utils';

export interface ChatState {
  unreadChannels: any,
  initChat: () => void,
  handleChatEvent: (userId: string, payload: any) => void
}

const useChatStore = (set, get) => ({
  unreadChannels: {},
  initChat: async () => {
    try {
      const response: AxiosResponse = await makeHttpRequest(apiConfig.Chat.init());
      const data = response.data?.data;

      const result = (data || []).reduce(
        // eslint-disable-next-line no-return-assign
        (
          obj: any, item: any,
          // eslint-disable-next-line no-sequences
        ) => ((obj[item.channelId] = item), obj),
        {},
      );

      set({ unreadChannels: result })
    } catch (error) {
      console.error('initChat', error)
    }
  },
  handleChatEvent: (userId: string, payload: any) => {
    let channel = null;
    const { unreadChannels } = get()
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
      // with immer
      set((state) => {
        state.unreadChannels[channel.id] = channel;
      });
    }

    // without immer
    // set({
    //   unreadChannels: {
    //     ...unreadChannels,
    //     ...channel,
    //   },
    // })
  },
});

export default createStore<ChatState>(withDevtools(withImmer(withPersist(useChatStore, { name: 'chat-store' }))));
