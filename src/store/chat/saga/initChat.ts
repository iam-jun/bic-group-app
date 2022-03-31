import {AxiosResponse} from 'axios';
import {put} from 'redux-saga/effects';
import apiConfig from '~/configs/apiConfig';
import {makeHttpRequest} from '~/services/httpApiRequest';

import actions from '../actions';

export default function* initChat() {
  try {
    const response: AxiosResponse = yield makeHttpRequest(
      apiConfig.Chat.init(),
    );
    const data = response.data?.data;

    const result = (data || []).reduce(
      (obj: any, item: any) => ((obj[item.channel_id] = item), obj),
      {},
    );

    yield put(actions.setUnreadChannels(result));
  } catch (err: any) {
    console.log('initChat error', err);
  }
}
