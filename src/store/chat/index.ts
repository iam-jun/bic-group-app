import { AxiosResponse } from 'axios';
import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import apiConfig from '~/configs/apiConfig';
import { makeHttpRequest } from '~/services/httpApiRequest';

export interface ChatState {
  unreadChannels: any,
  initChat: () => void,
  // setUnreadChannels: (payload: any) => void
}

const useChatStore = create(persist<ChatState>((set) => ({
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
})));

export default useChatStore;
