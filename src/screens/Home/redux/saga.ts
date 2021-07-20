import {takeLatest} from 'redux-saga/effects';
import {makeGetStreamRequest} from '~/services/httpApiRequest';

import {ActionTypes} from '~/utils';

export default function* homeSaga() {
  yield takeLatest(ActionTypes.GetStreamSample, getStreamSample);
}

function* getStreamSample({payload}: any) {
  const {streamClient} = payload;
  try {
    const streamResponse = yield makeGetStreamRequest(
      streamClient,
      'user',
      'userIdtest',
      'get',
      {limit: 5, offset: 5},
    );
    console.log('streamResponse:', streamResponse);
  } catch (e) {
    console.log('getStreamSample error:', e);
  }
}
