import streamApi from '~/api/StreamApi';
import { ITopicState } from '../index';

const getTopicDetail = (set) => async (payload: string) => {
  try {
    const response = await streamApi.getTopicDetail(payload);
    set((state: ITopicState) => {
      state.topicDetail = response?.data;
    }, 'getTopicDetailSuccess');
  } catch (err) {
    console.error('\x1b[31m🐣️ action getTopicDetail error: ', err, '\x1b[0m');
  }
};

export default getTopicDetail;
