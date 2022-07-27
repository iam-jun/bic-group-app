import { AxiosResponse } from 'axios';
import { put } from 'redux-saga/effects';
import apiConfig from '~/configs/apiConfig';
import { makeHttpRequest } from '~/services/httpApiRequest';

import actions from '../actions';

export default function* initChat() {
  try {
    const response: AxiosResponse = yield makeHttpRequest(apiConfig.Chat.init());
    const data = response.data?.data;

    const result = (data || []).reduce(
      // eslint-disable-next-line no-return-assign
      (
        obj: any, item: any,
      // eslint-disable-next-line no-sequences
      ) => ((obj[item.channel_id] = item), obj),
      {},
    );

    yield put(actions.setUnreadChannels(result));
  } catch (err: any) {
    console.error(
      'initChat error', err,
    );
  }
}
