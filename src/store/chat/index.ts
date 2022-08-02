import { AxiosResponse } from 'axios';
import apiConfig from '~/configs/apiConfig';
import { makeHttpRequest } from '~/services/httpApiRequest';
import { createStore, withDevtools, withPersist } from '../utils';

export interface ChatState {
  unreadChannels: any,
  initChat: () => void,
  // setUnreadChannels: (payload: any) => void
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
});

export default createStore<ChatState>(withDevtools(withPersist(useChatStore, { name: 'chat-store' })));
